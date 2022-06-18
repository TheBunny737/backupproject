//=============================================================================
// Maliki's Master Volume
// MalMasterVolume.js
// version 1.1a
//=============================================================================
/*:  
* @plugindesc ver1.1a - Allows players to utilize a single slider for all 4 sound profiles
 * @author Maliki79
 *
 * @param MasterMode
 * @desc Enter 1 to remove all other default volume settings leaving only 1 main setting for all sounds/music
 * Default: 1
 * @default 1
 * @help Version 1.1a
 * There is currently a few script calls for this Plugin.
 * The rest is Plug and Play.
 * Use the call AudioManager.setMasterVolume(value); to set the volume.
 * While it can be used to restore a muted game, it should typically only be used to mute.
 * To toggle mute off and on use AudioManager.toggleMute();
 * This will save the current volume, then set it to 0.
 * If called again, it will restore the sound if it hasn't been changed by the player.
 */
 
Object.defineProperty(ConfigManager, 'masterVolume', {
    get: function() {
        return ConfigManager.commandMasterVolume;
    },
    set: function(value) {
        ConfigManager.commandMasterVolume = value;
        AudioManager.updateBgmParameters(AudioManager._currentBgm);
        AudioManager.updateBgsParameters(AudioManager._currentBgs);
        AudioManager.updateMeParameters(AudioManager._currentMe);
    },
    configurable: true
});
 
 Object.defineProperty(AudioManager, 'masterVolume', {
    get: function() {
        return ConfigManager.commandMasterVolume;
    },
    set: function(value) {
        AudioManager.masterVolume = value;
    },
    configurable: true
});
 
var Mal_Config_MakeDataMV = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = Mal_Config_MakeDataMV.call(this);
    config.masterVolume = this.masterVolume;   
    return config;
};
 
var Mal_Config_applyDataMV = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Mal_Config_applyDataMV.call(this, config);
    this.masterVolume = this.readVolume(config, 'masterVolume');
};
 
 Window_Options.prototype.addVolumeOptions = function() {
    if(PluginManager.parameters('MalMasterVolume')['MasterMode'] == 1){
        this.addCommand("Volume", 'masterVolume');
    } else {
    this.addCommand("เสียงทั้งหมด", 'masterVolume');
    this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    this.addCommand(TextManager.bgsVolume, 'bgsVolume');
    /*this.addCommand(TextManager.meVolume, 'meVolume');
    this.addCommand(TextManager.seVolume, 'seVolume');*/
}
};
 
AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm, this.masterVolume);
};
AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs, this.masterVolume);
};
AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me, this.masterVolume);
};
AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se, this.masterVolume);
};
 
AudioManager.updateBufferParameters = function(buffer, configVolume, audio, master) {
    if (buffer && audio) {
        configVolume *= master / 100;
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};
 
AudioManager.setMasterVolume = function(value) {
var value2 = value;
if (value2 > 100) value2 = 100;
if (value2 < 0) value2 = 0;
    ConfigManager.commandMasterVolume = value2;
    AudioManager.updateBgmParameters(AudioManager._currentBgm);
    AudioManager.updateBgsParameters(AudioManager._currentBgs);
    AudioManager.updateMeParameters(AudioManager._currentMe);
};
 
AudioManager.toggleMute = function() {
    if (!AudioManager.mute) AudioManager.mute = false;
    if (ConfigManager.commandMasterVolume > 0) AudioManager.mute = false;
    if (AudioManager.mute == false) {
    AudioManager.mute = ConfigManager.commandMasterVolume;
    ConfigManager.commandMasterVolume = 0;
    AudioManager.updateBgmParameters(AudioManager._currentBgm);
    AudioManager.updateBgsParameters(AudioManager._currentBgs);
    AudioManager.updateMeParameters(AudioManager._currentMe);
    } else {
    ConfigManager.commandMasterVolume = AudioManager.mute;
    AudioManager.updateBgmParameters(AudioManager._currentBgm);
    AudioManager.updateBgsParameters(AudioManager._currentBgs);
    AudioManager.updateMeParameters(AudioManager._currentMe);
    AudioManager.mute = false;
    }
    }