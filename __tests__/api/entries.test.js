// __tests__/api/entries.test.js
import { mockFirestore } from '../../test-utils/firestore-mock';
import handler from '../../pages/api/entries';

// Mock Firebase to prevent initialization errors
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore),
  collection: jest.fn(() => mockFirestore.collection),
  addDoc: mockFirestore.collection.add,
  getDocs: mockFirestore.collection.get,
}));

const mockRequest = (method, body = null) => ({
  method,
  body,
  headers: { 'Content-Type': 'application/json' },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Entries API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save an entry on POST', async () => {
    const req = mockRequest('POST', {
      title: 'Test',
      content: 'Content',
      timestamp: '2025-04-22T08:00:00Z',
    });
    const res = mockResponse();
    mockFirestore.collection.add.mockResolvedValue({ id: '123' });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Entry saved' });
  });

  it('should return error for missing fields on POST', async () => {
    const req = mockRequest('POST', { title: 'Test' });
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Title and content are required' });
  });

  it('should fetch entries on GET', async () => {
    const req = mockRequest('GET');
    const res = mockResponse();
    mockFirestore.collection.get.mockResolvedValue({
      docs: [
        {
          id: '123',
          data: () => ({
            title: 'Test',
            content: 'Content',
            timestamp: { toDate: () => new Date('2025-04-22T08:00:00Z') },
          }),
        },
      ],
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      entries: [
        {
          id: '123',
          title: 'Test',
          content: 'Content',
          timestamp: '2025-04-22T08:00:00.000Z',
        },
      ],
    });
  });

  it('should return 405 for unsupported methods', async () => {
    const req = mockRequest('PUT');
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });
});