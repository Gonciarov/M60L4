// test-utils/firestore-mock.js
export const mockFirestore = {
  collection: {
    add: jest.fn(),
    get: jest.fn(),
  },
};
export const getFirestore = jest.fn(() => mockFirestore);
export const collection = jest.fn(() => mockFirestore.collection);
export const addDoc = mockFirestore.collection.add;
export const getDocs = mockFirestore.collection.get;
export const initializeApp = jest.fn();