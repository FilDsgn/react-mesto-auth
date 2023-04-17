export const baseUrl = "https://auth.nomoreparties.co";

export const register = (password, email) => {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};

export const authorize = (password, email) => {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};

export const getContent = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
