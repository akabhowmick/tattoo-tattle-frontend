PRAGMA foreign_key = ON;
DROP TABLE clients;
DROP TABLE artists;
CREATE TABLE clients (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, phoneNumber TEXT NOT NULL);
CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT,firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, phoneNumber TEXT NOT NULL, statesLocation TEXT NOT NULL, tattooStyles TEXT NOT NULL);
CREATE TABLE tattoos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, dateCreated TEXT NOT NULL, artist TEXT NOT NULL, statesInput TEXT NOT NULL, tattooStyleInput TEXT NOT NULL, image TEXT NOT NULL, price INTEGER NOT NULL, artistID INTEGER NOT NULL, FOREIGN KEY(artistId) REFERENCES artists(id));
CREATE TABLE requests (id INTEGER PRIMARY KEY AUTOINCREMENT, clientName TEXT NOT NULL, artistName TEXT NOT NULL, messageBody TEXT NOT NULL, approvalStatus TEXT NOT NULL, tattooOfInterestTitle TEXT NOT NULL, artistID INTEGER NOT NULL, clientID INTEGER NOT NULL, FOREIGN KEY(artistId) REFERENCES artists(id), FOREIGN KEY(clientId) REFERENCES clients(id));
CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, tattooId INTEGER NOT NULL, userID INTEGER NOT NULL, FOREIGN KEY(tattooId) REFERENCES tattoos(id), FOREIGN KEY(userId) REFERENCES clients(id));


client

{
    "firstName": "Frank",
    "lastName": "Sanford",
    "email": "fakedata28714@gmail.com",
    "password": "1234asdfQ!",
    "phoneNumber": "3992788746",
    "type": "client"
}

artist
{
    "email": "fakedata4@gmail.com",
    "firstName": "Fraco",
    "lastName": "Sand",
    "password": "1234asdfQ!",
    "phoneNumber": "3992788746",
    "statesLocation": "['NY', 'NJ']",
    "tattooStyles": "['Watercolor']",
    "type": "artist"
}

request
{
      "clientName": "Amelia Boyer",
      "artistName": "Vergie Schuster",
      "messageBody": "This is even really cool!  ",
      "approvalStatus": "Pending",
      "tattooOfInterestTitle": "Dynamic Identity Architec",
      "artistId": 1,
      "clientId": 1,
    },
