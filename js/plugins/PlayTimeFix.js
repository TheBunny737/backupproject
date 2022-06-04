/*:
 * @plugindesc Don't count frames to calculate time
 * @author erri120
 *
 * @help
 * Playtime is calculated using the current frameCount and expecting
 * the game to constantly run at 60 FPS. This is stupid and fixed in
 * this plugin which replaces the Game_System.playtime and
 * Game_System.playtimeText functions to use a simple Date object to
 * calculate the current playtime.
 *
 * For more information, see this blog post I created:
 * https://erri120.github.io/posts/2021-09-29/
*/

(function() {
    // saving the old functions so we can call them again
    // it's important to use .bind() since the context changed and without
    // "this" would refer to the current Window instead of Game_System.
    const __old_Game_System_initialize = Game_System.prototype.initialize;
    const __old_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    const __old_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  
    // number of milliseconds in a day
    const maxMilliseconds = 86400000;
  
    // partial replacement
    Game_System.prototype.initialize = function() {
      __old_Game_System_initialize.bind(this)();
  
      this._startTime = Date.now();
      this._playtime = 0;
    };
  
    // partial replacement
    Game_System.prototype.onAfterLoad = function() {
      __old_Game_System_onAfterLoad.bind(this)();
  
      this._startTime = Date.now();
    };
  
    // partial replacement
    Game_System.prototype.onBeforeSave = function() {
      __old_Game_System_onBeforeSave.bind(this)();
  
      this._playtime += Date.now() - this._startTime;
      this._startTime = Date.now();
    };
  
    // complete replacement
    Game_System.prototype.playtime = function() {
      // can't display more than 23:59:59 so we need to cap this value
      const playtime = this._playtime >= maxMilliseconds ?
        maxMilliseconds - 1 :
        this._playtime;
  
      // playtime is in milliseconds so we convert it to seconds
      // in case some other functiosn rely on the original one
      return Math.floor(playtime / 1000);
    };
  
    // complete replacement
    Game_System.prototype.playtimeText = function() {
      const secondsPassed = this.playtime();
      const minutesPassed = Math.floor(secondsPassed / 60);
      const hoursPassed = Math.floor(minutesPassed / 60);
  
      const sec = secondsPassed % 60;
      const min = minutesPassed % 60;
      const hour = hoursPassed % 24;
  
      return String(hour).padStart(2, '0') + ':' +
        String(min).padStart(2, '0') + ':' +
        String(sec).padStart(2, '0');
    };
  })();