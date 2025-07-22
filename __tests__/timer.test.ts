import { Timer, TimerState, TimerEvent } from '../src/timer';

describe('Timer', () => {
  let timer: Timer;

  beforeEach(() => {
    timer = new Timer();
  });

  describe('constructor', () => {
    it('should initialize with IDLE state and 0 seconds', () => {
      expect(timer.getState()).toBe(TimerState.IDLE);
      expect(timer.getCurrentSeconds()).toBe(0);
    });
  });

  describe('start', () => {
    it('should start the timer with given duration', () => {
      timer.start(30);

      expect(timer.getState()).toBe(TimerState.RUNNING);
      expect(timer.getCurrentSeconds()).toBe(30);
    });

    it('should throw error when starting already running timer', () => {
      timer.start(30);

      expect(() => timer.start(30)).toThrow('Timer is already running');
    });
  });

  describe('pause', () => {
    it('should pause running timer', () => {
      timer.start(30);
      timer.pause();

      expect(timer.getState()).toBe(TimerState.PAUSED);
    });

    it('should throw error when pausing non-running timer', () => {
      expect(() => timer.pause()).toThrow('Timer is not running');
    });
  });

  describe('resume', () => {
    it('should resume paused timer', () => {
      timer.start(30);
      timer.pause();
      timer.resume();

      expect(timer.getState()).toBe(TimerState.RUNNING);
    });

    it('should throw error when resuming non-paused timer', () => {
      expect(() => timer.resume()).toThrow('Timer is not paused');
    });
  });

  describe('stop', () => {
    it('should stop running timer', () => {
      timer.start(30);
      timer.stop();

      expect(timer.getState()).toBe(TimerState.IDLE);
      expect(timer.getCurrentSeconds()).toBe(0);
    });

    it('should stop paused timer', () => {
      timer.start(30);
      timer.pause();
      timer.stop();

      expect(timer.getState()).toBe(TimerState.IDLE);
      expect(timer.getCurrentSeconds()).toBe(0);
    });
  });

  describe('tick', () => {
    it('should decrement seconds when running', () => {
      timer.start(30);
      timer.tick();

      expect(timer.getCurrentSeconds()).toBe(29);
    });

    it('should not decrement when paused', () => {
      timer.start(30);
      timer.pause();
      timer.tick();

      expect(timer.getCurrentSeconds()).toBe(30);
    });

    it('should not decrement when idle', () => {
      timer.tick();

      expect(timer.getCurrentSeconds()).toBe(0);
    });

    it('should complete timer when reaching 0', () => {
      timer.start(1);
      timer.tick();

      expect(timer.getState()).toBe(TimerState.COMPLETED);
      expect(timer.getCurrentSeconds()).toBe(0);
    });
  });

  describe('event handling', () => {
    it('should notify listeners on tick', () => {
      const mockListener = jest.fn();
      timer.on(TimerEvent.TICK, mockListener);

      timer.start(30);
      timer.tick();

      expect(mockListener).toHaveBeenCalledWith(29);
    });

    it('should notify listeners on completion', () => {
      const mockListener = jest.fn();
      timer.on(TimerEvent.COMPLETE, mockListener);

      timer.start(1);
      timer.tick();

      expect(mockListener).toHaveBeenCalled();
    });

    it('should remove event listeners', () => {
      const mockListener = jest.fn();
      timer.on(TimerEvent.TICK, mockListener);
      timer.off(TimerEvent.TICK, mockListener);

      timer.start(30);
      timer.tick();

      expect(mockListener).not.toHaveBeenCalled();
    });
  });
});
