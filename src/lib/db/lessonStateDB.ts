const DB_NAME = 'lessonStateDB';
const STORE_NAME = 'lessonStates';
const DB_VERSION = 1;

class LessonStateDB {
  private db: IDBDatabase | null = null;
  private static instance: LessonStateDB;

  private constructor() {}

  public static getInstance(): LessonStateDB {
    if (!LessonStateDB.instance) {
      LessonStateDB.instance = new LessonStateDB();
    }
    return LessonStateDB.instance;
  }

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject('Error opening database');
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'lessonId' });
        }
      };
    });
  }

  private async getObjectStore(mode: IDBTransactionMode = 'readonly') {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  public async getLessonState(lessonId: string): Promise<{
    questions: Record<string, boolean>;
    exercises: Record<string, boolean>;
  } | null> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve) => {
        const request = store.get(lessonId);
        request.onsuccess = () => resolve(request.result?.state || null);
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('Error getting lesson state:', error);
      return null;
    }
  }

  public async updateQuestionState(
    lessonId: string,
    questionIndex: number | string,
    isVisible: boolean
  ): Promise<boolean> {
    try {
      const store = await this.getObjectStore('readwrite');
      return new Promise((resolve) => {
        const request = store.get(lessonId);
        
        request.onsuccess = () => {
          const data = request.result || { lessonId, state: { questions: {}, exercises: {} } };
          
          if (!data.state.questions) data.state.questions = {};
          data.state.questions[String(questionIndex)] = isVisible;
          
          const updateRequest = store.put(data);
          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = () => resolve(false);
        };
        
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Error updating question state:', error);
      return false;
    }
  }

  public async updateExerciseState(
    lessonId: string,
    exerciseIndex: number | string,
    isVisible: boolean
  ): Promise<boolean> {
    try {
      const store = await this.getObjectStore('readwrite');
      return new Promise((resolve) => {
        const request = store.get(lessonId);
        
        request.onsuccess = () => {
          const data = request.result || { lessonId, state: { questions: {}, exercises: {} } };
          
          if (!data.state.exercises) data.state.exercises = {};
          data.state.exercises[String(exerciseIndex)] = isVisible;
          
          const updateRequest = store.put(data);
          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = () => resolve(false);
        };
        
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Error updating exercise state:', error);
      return false;
    }
  }

  public async clearLessonState(lessonId: string): Promise<boolean> {
    try {
      const store = await this.getObjectStore('readwrite');
      return new Promise((resolve) => {
        const request = store.delete(lessonId);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Error clearing lesson state:', error);
      return false;
    }
  }
}

export const lessonStateDB = LessonStateDB.getInstance();
