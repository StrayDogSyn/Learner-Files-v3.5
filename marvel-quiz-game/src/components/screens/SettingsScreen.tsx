import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Music, 
  Zap, 
  Eye, 
  Accessibility,
  Globe,
  Palette,
  Save,
  RotateCcw
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

interface SettingSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}

function SettingSection({ title, icon: Icon, children }: SettingSectionProps) {
  return (
    <GlassPanel className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </GlassPanel>
  );
}

interface ToggleSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSetting({ label, description, value, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-all duration-300",
          value ? "bg-blue-500" : "bg-gray-600"
        )}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          animate={{
            left: value ? 26 : 2
          }}
          transition={{ duration: 0.2 }}
        />
      </button>
    </div>
  );
}

interface SliderSettingProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

function SliderSetting({ 
  label, 
  description, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange,
  formatValue = (v) => v.toString()
}: SliderSettingProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="text-white font-medium">{label}</div>
          {description && (
            <div className="text-sm text-gray-400">{description}</div>
          )}
        </div>
        <div className="text-blue-400 font-bold min-w-[60px] text-right">
          {formatValue(value)}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectSetting({ label, description, value, options, onChange }: SelectSettingProps) {
  return (
    <div>
      <div className="mb-2">
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SettingsScreen() {
  const { settings, updateSettings, setCurrentScreen } = useGameStore();
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings] = useState(settings);

  const handleSettingChange = (category: string, key: string, value: any) => {
    updateSettings({ [category]: { [key]: value } });
    setHasChanges(true);
  };

  const handleSave = () => {
    // Settings are automatically saved via Zustand persistence
    setHasChanges(false);
    // Show success notification
  };

  const handleReset = () => {
    updateSettings(originalSettings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <GlassButton
              onClick={() => setCurrentScreen('home')}
              className="p-3 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </GlassButton>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          
          {hasChanges && (
            <div className="flex gap-2">
              <GlassButton
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500/30 text-white hover:bg-gray-500/50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </GlassButton>
              <GlassButton
                onClick={handleSave}
                className="px-4 py-2 bg-green-500/30 text-white hover:bg-green-500/50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </GlassButton>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingSection title="Audio" icon={Volume2}>
              <SliderSetting
                label="Master Volume"
                description="Overall game volume"
                value={settings.audio.masterVolume}
                min={0}
                max={1}
                step={0.1}
                onChange={(value) => handleSettingChange('audio', 'masterVolume', value)}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
              
              <ToggleSetting
                label="Sound Effects"
                description="Button clicks, notifications, and game sounds"
                value={settings.audio.soundEffects}
                onChange={(value) => handleSettingChange('audio', 'soundEffects', value)}
              />
              
              <ToggleSetting
                label="Background Music"
                description="Epic Marvel-themed background music"
                value={settings.audio.music}
                onChange={(value) => handleSettingChange('audio', 'music', value)}
              />
              
              <ToggleSetting
                label="Voice Commands"
                description="Control the game with voice commands"
                value={settings.audio.voiceCommands}
                onChange={(value) => handleSettingChange('audio', 'voiceCommands', value)}
              />
            </SettingSection>
          </motion.div>

          {/* Graphics Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SettingSection title="Graphics" icon={Eye}>
              <ToggleSetting
                label="Animations"
                description="Smooth transitions and motion effects"
                value={settings.graphics.animations}
                onChange={(value) => handleSettingChange('graphics', 'animations', value)}
              />
              
              <ToggleSetting
                label="Particle Effects"
                description="Cosmic background particles and visual effects"
                value={settings.graphics.particles}
                onChange={(value) => handleSettingChange('graphics', 'particles', value)}
              />
              
              <SelectSetting
                label="Graphics Quality"
                description="Adjust visual quality for performance"
                value={settings.graphics.quality}
                options={[
                  { value: 'low', label: 'Low (Better Performance)' },
                  { value: 'medium', label: 'Medium (Balanced)' },
                  { value: 'high', label: 'High (Best Quality)' }
                ]}
                onChange={(value) => handleSettingChange('graphics', 'quality', value)}
              />
            </SettingSection>
          </motion.div>

          {/* Gameplay Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SettingSection title="Gameplay" icon={Zap}>
              <SelectSetting
                label="Default Difficulty"
                description="Starting difficulty for new games"
                value={settings.gameplay.difficulty}
                options={[
                  { value: 'easy', label: 'Easy (Beginner)' },
                  { value: 'medium', label: 'Medium (Intermediate)' },
                  { value: 'hard', label: 'Hard (Expert)' }
                ]}
                onChange={(value) => handleSettingChange('gameplay', 'difficulty', value)}
              />
              
              <ToggleSetting
                label="Auto Advance"
                description="Automatically move to next question after answering"
                value={settings.gameplay.autoAdvance}
                onChange={(value) => handleSettingChange('gameplay', 'autoAdvance', value)}
              />
              
              <ToggleSetting
                label="Show Hints"
                description="Display helpful hints for difficult questions"
                value={settings.gameplay.showHints}
                onChange={(value) => handleSettingChange('gameplay', 'showHints', value)}
              />
              
              <ToggleSetting
                label="Confirm Answers"
                description="Require confirmation before submitting answers"
                value={settings.gameplay.confirmAnswers}
                onChange={(value) => handleSettingChange('gameplay', 'confirmAnswers', value)}
              />
            </SettingSection>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SettingSection title="Accessibility" icon={Accessibility}>
              <ToggleSetting
                label="High Contrast"
                description="Increase contrast for better visibility"
                value={settings.accessibility.highContrast}
                onChange={(value) => handleSettingChange('accessibility', 'highContrast', value)}
              />
              
              <ToggleSetting
                label="Large Text"
                description="Increase text size for better readability"
                value={settings.accessibility.largeText}
                onChange={(value) => handleSettingChange('accessibility', 'largeText', value)}
              />
              
              <ToggleSetting
                label="Reduced Motion"
                description="Minimize animations and motion effects"
                value={settings.accessibility.reducedMotion}
                onChange={(value) => handleSettingChange('accessibility', 'reducedMotion', value)}
              />
              
              <ToggleSetting
                label="Screen Reader Support"
                description="Enhanced support for screen readers"
                value={settings.accessibility.screenReader}
                onChange={(value) => handleSettingChange('accessibility', 'screenReader', value)}
              />
            </SettingSection>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <GlassPanel className="p-4">
            <p className="text-gray-400 text-sm">
              Settings are automatically saved. Changes take effect immediately.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
              <span>Marvel Quiz Game v1.0.0</span>
              <span>•</span>
              <span>Built with ❤️ for Marvel fans</span>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

export default SettingsScreen;