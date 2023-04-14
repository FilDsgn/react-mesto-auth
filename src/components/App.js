import React from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import DeleteCardPopup from "./DeleteCardPopup.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const [cards, setCards] = React.useState([]);

  const isPopupOpen =
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isEditAvatarPopupOpen ||
    isConfirmPopupOpen ||
    isImagePopupOpen;

  React.useEffect(() => {
    api
      .getCardList()
      .then((cardList) => {
        setCards(cardList);
      })
      .catch((err) => console.log(err));

    api
      .getUserInfo()
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((err) => console.log(err));
  }, []);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmPopupOpen(false);
  }

  function closeOnOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeAllPopups();
    }
  }

  const closePopupsOnEsc = React.useCallback((e) => {
    if (e.key === "Escape") {
      closeAllPopups();
    }
  }, []);

  React.useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("keydown", closePopupsOnEsc);
      return () => document.removeEventListener("keydown", closePopupsOnEsc);
    }
  }, [isPopupOpen, closePopupsOnEsc]);

  function handleTransitionEnd() {
    if (!isPopupOpen) {
      setSelectedCard({});
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);

    api
      .changeLikeCardStatus(card.id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card.id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    const isOwn = card.owner._id === currentUser._id;
    setIsLoading(true);

    if (isOwn) {
      api
        .deleteCard(card.id)
        .then(() => {
          setCards((state) => state.filter((c) => c._id !== card.id));
          closeAllPopups();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  }

  function handleCardDeleteClick(card) {
    setIsConfirmPopupOpen(true);
    setSelectedCard(card);
  }

  function handleCardImageClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(updateUserInfo) {
    setIsLoading(true);
    api
      .setUserInfo(updateUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(updateUserAvatar) {
    setIsLoading(true);
    api
      .setUserAvatar(updateUserAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api
      .createCard(newCard)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header />
          <Main
            cards={cards}
            onEditProfile={setIsEditProfilePopupOpen}
            onAddPlace={setIsAddPlacePopupOpen}
            onEditAvatar={setIsEditAvatarPopupOpen}
            onCardClick={handleCardImageClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDeleteClick}
          />
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onOverlayClick={closeOnOverlayClick}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onOverlayClick={closeOnOverlayClick}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onOverlayClick={closeOnOverlayClick}
            onAddPlace={handleAddPlaceSubmit}
            onLoading={isLoading}
          />

          <ImagePopup
            card={selectedCard}
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            onOverlayClick={closeOnOverlayClick}
            onTransitionEnd={handleTransitionEnd}
          />

          <DeleteCardPopup
            card={selectedCard}
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onOverlayClick={closeOnOverlayClick}
            onTransitionEnd={handleTransitionEnd}
            onCardDelete={handleCardDelete}
            onLoading={isLoading}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
