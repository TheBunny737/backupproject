// MenuPlaytime.js

/*:
 * @plugindesc Provides a playtime window for your menu. Works with Yanfly Engine Plugins.
 * @author JGreene
 *
 * @help Place this plugin below all of Yanfly's Plugins in your load order.
 */

(function() {

    var _Scene_Menu_new = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_new.call(this);
        this._statusWindow.x = this._commandWindow.width;
        this._statusWindow.y = 0;
		this.createPlaytimeWindow();
        this._goldWindow.x = 0;
		this._goldWindow.width = this._commandWindow.width;
		this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
    };
	
	// Refresh playtime window
	
	Scene_Menu.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        this._playtimeWindow.refresh();
    }
	
 // Playtime window
	
	Scene_Menu.prototype.createPlaytimeWindow = function() {
    this._playtimeWindow = new Window_Playtime(0, 0);
	this._playtimeWindow.width = this._commandWindow.width;
    this._playtimeWindow.x = 0;
	this._playtimeWindow.y = Graphics.boxHeight - (this._playtimeWindow.height*3);
    this.addWindow(this._playtimeWindow);
	};
	
	function Window_Playtime() {
		this.initialize.apply(this, arguments);
	}
	
	Window_Playtime.prototype = Object.create(Window_Base.prototype);
	Window_Playtime.prototype.constructor = Window_Playtime;
	
	Window_Playtime.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.refresh();
	};
	
	Window_Playtime.prototype.windowWidth = function() {
		return 240;
	};
	
	Window_Playtime.prototype.windowHeight = function() {
		return this.fittingHeight(1);
	};
	
	Window_Playtime.prototype.refresh = function() {
		var x = this.textPadding();
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawText(this.value(), x, 0, width);
	};
	
	Window_Playtime.prototype.value = function() {
			return $gameSystem.playtimeText();
	};
	
	
	Window_Playtime.prototype.open = function() {
		this.refresh();
		Window_Base.prototype.open.call(this);
	};

})();