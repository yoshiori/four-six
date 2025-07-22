import { PourTimer, PourTimerEvent } from '../src/pour-timer';
import { Pour } from '../src/brewing';

describe('PourTimer', () => {
  let pourTimer: PourTimer;
  let mockPours: Pour[];

  beforeEach(() => {
    mockPours = [
      { amount: 60, timing: 0 },
      { amount: 60, timing: 45 },
      { amount: 50, timing: 30 },
      { amount: 50, timing: 30 },
      { amount: 50, timing: 30 },
    ];
    pourTimer = new PourTimer(mockPours);
  });

  describe('constructor', () => {
    it('should initialize with first pour index 0', () => {
      expect(pourTimer.getCurrentPourIndex()).toBe(0);
      expect(pourTimer.getTotalPours()).toBe(5);
      expect(pourTimer.isFinished()).toBe(false);
    });

    it('should throw error with empty pours array', () => {
      expect(() => new PourTimer([])).toThrow('Pours array cannot be empty');
    });
  });

  describe('start', () => {
    it('should start with first pour ready event', () => {
      const mockListener = jest.fn();
      pourTimer.on(PourTimerEvent.POUR_READY, mockListener);

      pourTimer.start();

      expect(mockListener).toHaveBeenCalledWith(0, 60);
    });

    it('should throw error when already started', () => {
      pourTimer.start();
      expect(() => pourTimer.start()).toThrow('Timer is already started');
    });
  });

  describe('nextPour', () => {
    it('should advance to next pour', () => {
      const mockListener = jest.fn();
      pourTimer.on(PourTimerEvent.POUR_READY, mockListener);

      pourTimer.start();
      pourTimer.nextPour();

      expect(pourTimer.getCurrentPourIndex()).toBe(1);
      expect(mockListener).toHaveBeenCalledWith(1, 60);
    });

    it('should complete after last pour', () => {
      const mockListener = jest.fn();
      pourTimer.on(PourTimerEvent.COMPLETE, mockListener);

      pourTimer.start();

      // Go through all pours (5 pours total, so 4 more after start)
      for (let i = 0; i < 5; i++) {
        pourTimer.nextPour();
      }

      expect(pourTimer.isFinished()).toBe(true);
      expect(mockListener).toHaveBeenCalled();
    });

    it('should throw error when completed', () => {
      pourTimer.start();

      // Complete all pours
      for (let i = 0; i < 5; i++) {
        pourTimer.nextPour();
      }

      expect(() => pourTimer.nextPour()).toThrow('Timer is already completed');
    });
  });

  describe('getCurrentPour', () => {
    it('should return current pour information', () => {
      pourTimer.start();

      const currentPour = pourTimer.getCurrentPour();
      expect(currentPour).toEqual({ amount: 60, timing: 0 });
    });

    it('should return null when completed', () => {
      pourTimer.start();

      // Complete all pours
      for (let i = 0; i < 5; i++) {
        pourTimer.nextPour();
      }

      expect(pourTimer.getCurrentPour()).toBeNull();
    });
  });

  describe('getProgress', () => {
    it('should return progress as percentage', () => {
      pourTimer.start();
      expect(pourTimer.getProgress()).toBe(0); // 0/5 * 100

      pourTimer.nextPour();
      expect(pourTimer.getProgress()).toBe(20); // 1/5 * 100

      pourTimer.nextPour();
      expect(pourTimer.getProgress()).toBe(40); // 2/5 * 100
    });

    it('should return 100% when completed', () => {
      pourTimer.start();

      // Complete all pours
      for (let i = 0; i < 5; i++) {
        pourTimer.nextPour();
      }

      expect(pourTimer.getProgress()).toBe(100);
    });
  });

  describe('event handling', () => {
    it('should emit pour ready events', () => {
      const mockListener = jest.fn();
      pourTimer.on(PourTimerEvent.POUR_READY, mockListener);

      pourTimer.start();

      expect(mockListener).toHaveBeenCalledWith(0, 60);
    });

    it('should emit completion event', () => {
      const mockListener = jest.fn();
      pourTimer.on(PourTimerEvent.COMPLETE, mockListener);

      pourTimer.start();

      // Complete all pours
      for (let i = 0; i < 5; i++) {
        pourTimer.nextPour();
      }

      expect(mockListener).toHaveBeenCalled();
    });
  });
});
