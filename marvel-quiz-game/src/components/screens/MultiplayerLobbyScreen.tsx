import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Search, 
  Crown, 
  Settings, 
  Play, 
  Copy, 
  Check,
  Globe,
  Lock,
  Zap,
  Clock,
  Target,
  Gamepad2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock multiplayer data (in real app, this would come from Socket.io)
const mockRooms = [
  {
    id: 'room-1',
    name: 'Avengers Assemble',
    host: 'StarkGenius',
    players: [
      { id: '1', username: 'StarkGenius', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Iron%20Man%20helmet%20avatar%20profile%20picture%20red%20gold%20metallic&image_size=square', isHost: true, isReady: true },
      { id: '2', username: 'WebSlinger', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Spider-Man%20mask%20avatar%20profile%20picture%20red%20blue%20web&image_size=square', isHost: false, isReady: true },
      { id: '3', username: 'ShieldAgent', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Captain%20America%20shield%20avatar%20profile%20picture%20blue%20red%20white&image_size=square', isHost: false, isReady: false }
    ],
    maxPlayers: 4,
    gameMode: 'blitz',
    difficulty: 'medium',
    isPrivate: false,
    status: 'waiting'
  },
  {
    id: 'room-2',
    name: 'X-Men Challenge',
    host: 'ProfessorX',
    players: [
      { id: '4', username: 'ProfessorX', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professor%20X%20telepathic%20avatar%20profile%20picture%20bald%20wise&image_size=square', isHost: true, isReady: true },
      { id: '5', username: 'Wolverine', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Wolverine%20claws%20avatar%20profile%20picture%20fierce%20mutant&image_size=square', isHost: false, isReady: true }
    ],
    maxPlayers: 6,
    gameMode: 'survival',
    difficulty: 'hard',
    isPrivate: false,
    status: 'waiting'
  },
  {
    id: 'room-3',
    name: 'Guardians Quiz',
    host: 'StarLord',
    players: [
      { id: '6', username: 'StarLord', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Star%20Lord%20mask%20avatar%20profile%20picture%20space%20guardian&image_size=square', isHost: true, isReady: true },
      { id: '7', username: 'Gamora', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Gamora%20green%20avatar%20profile%20picture%20warrior%20guardian&image_size=square', isHost: false, isReady: true },
      { id: '8', username: 'Rocket', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Rocket%20raccoon%20avatar%20profile%20picture%20guardian%20space&image_size=square', isHost: false, isReady: true },
      { id: '9', username: 'Groot', avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Groot%20tree%20avatar%20profile%20picture%20guardian%20nature&image_size=square', isHost: false, isReady: false }
    ],
    maxPlayers: 4,
    gameMode: 'story',
    difficulty: 'easy',
    isPrivate: true,
    status: 'waiting'
  }
];

interface RoomCardProps {
  room: any;
  onJoin: (roomId: string) => void;
}

function RoomCard({ room, onJoin }: RoomCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };
  
  const getGameModeIcon = (mode: string) => {
    switch (mode) {
      case 'blitz': return <Zap className="w-4 h-4" />;
      case 'survival': return <Target className="w-4 h-4" />;
      case 'story': return <Gamepad2 className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <GlassPanel className="p-4 hover:bg-white/10 transition-all duration-300 border border-white/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white">{room.name}</h3>
              {room.isPrivate && <Lock className="w-4 h-4 text-yellow-400" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Host: {room.host}</span>
              <Crown className="w-3 h-3 text-yellow-400" />
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-bold",
              getDifficultyColor(room.difficulty)
            )}>
              {room.difficulty.toUpperCase()}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              {getGameModeIcon(room.gameMode)}
              <span>{room.gameMode}</span>
            </div>
          </div>
        </div>
        
        {/* Players */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Players</span>
            <span className="text-sm text-gray-400">
              {room.players.length}/{room.maxPlayers}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {room.players.map((player: any) => (
              <div key={player.id} className="relative">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    player.isReady ? "border-green-400" : "border-gray-400"
                  )}
                  onError={(e) => {
                    e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20avatar%20profile%20picture%20mask&image_size=square';
                  }}
                />
                {player.isHost && (
                  <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                )}
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Join Button */}
        <GlassButton
          onClick={() => onJoin(room.id)}
          disabled={room.players.length >= room.maxPlayers}
          className={cn(
            "w-full py-2",
            room.players.length >= room.maxPlayers
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-500/30"
          )}
        >
          {room.players.length >= room.maxPlayers ? 'Room Full' : 'Join Room'}
        </GlassButton>
      </GlassPanel>
    </motion.div>
  );
}

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomData: any) => void;
}

function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [gameMode, setGameMode] = useState('blitz');
  const [difficulty, setDifficulty] = useState('medium');
  const [isPrivate, setIsPrivate] = useState(false);
  
  const handleCreate = () => {
    if (!roomName.trim()) return;
    
    onCreate({
      name: roomName,
      maxPlayers,
      gameMode,
      difficulty,
      isPrivate
    });
    
    // Reset form
    setRoomName('');
    setMaxPlayers(4);
    setGameMode('blitz');
    setDifficulty('medium');
    setIsPrivate(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassPanel className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Create Room</h2>
          
          <div className="space-y-4">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
              />
            </div>
            
            {/* Max Players */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Players: {maxPlayers}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full"
                aria-label="Maximum number of players"
                title={`Maximum players: ${maxPlayers}`}
              />
            </div>
            
            {/* Game Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Mode
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                aria-label="Select game mode"
                title="Select game mode"
              >
                <option value="blitz" className="bg-gray-800">Blitz Mode</option>
                <option value="survival" className="bg-gray-800">Survival Mode</option>
                <option value="story" className="bg-gray-800">Story Mode</option>
              </select>
            </div>
            
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                aria-label="Select difficulty level"
                title="Select difficulty level"
              >
                <option value="easy" className="bg-gray-800">Easy</option>
                <option value="medium" className="bg-gray-800">Medium</option>
                <option value="hard" className="bg-gray-800">Hard</option>
              </select>
            </div>
            
            {/* Private Room */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="private" className="text-sm text-gray-300">
                Private Room (invite only)
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <GlassButton
              onClick={onClose}
              className="flex-1 py-2 hover:bg-white/10"
            >
              Cancel
            </GlassButton>
            <GlassButton
              onClick={handleCreate}
              disabled={!roomName.trim()}
              className="flex-1 py-2 bg-blue-500/30 hover:bg-blue-500/40 disabled:opacity-50"
            >
              Create Room
            </GlassButton>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

export function MultiplayerLobbyScreen() {
  const { setCurrentScreen, player } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [rooms, setRooms] = useState(mockRooms);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.host.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleJoinRoom = (roomId: string) => {
    // In real app, this would emit a socket event
    console.log('Joining room:', roomId);
    // For demo, just start the game
    setCurrentScreen('game-arena');
  };
  
  const handleCreateRoom = (roomData: any) => {
    // In real app, this would emit a socket event
    const newRoom = {
      id: `room-${Date.now()}`,
      ...roomData,
      host: player.username,
      players: [{
        id: 'current',
        username: player.username,
        avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20logo%20avatar%20profile%20picture%20red%20comic%20book%20style&image_size=square',
        isHost: true,
        isReady: true
      }],
      status: 'waiting'
    };
    
    setRooms(prev => [newRoom, ...prev]);
  };
  
  const copyRoomCode = (roomId: string) => {
    navigator.clipboard.writeText(roomId);
    setCopiedRoomId(roomId);
    setTimeout(() => setCopiedRoomId(null), 2000);
  };
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
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
            <div>
              <h1 className="text-3xl font-bold text-white">Multiplayer Lobby</h1>
              <p className="text-gray-400">Join or create a room to play with friends</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            )}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <GlassButton
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/40"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </GlassButton>
          </div>
        </motion.div>
        
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassPanel className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                <GlassButton className="px-4 py-2 hover:bg-white/10">
                  <Globe className="w-4 h-4 mr-2" />
                  Public Rooms
                </GlassButton>
                <GlassButton className="px-4 py-2 hover:bg-white/10">
                  <Users className="w-4 h-4 mr-2" />
                  Friends
                </GlassButton>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Room Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{rooms.length}</div>
            <div className="text-sm text-gray-400">Active Rooms</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {rooms.reduce((sum, room) => sum + room.players.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Players Online</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {rooms.filter(room => room.status === 'waiting').length}
            </div>
            <div className="text-sm text-gray-400">Waiting Rooms</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {rooms.filter(room => !room.isPrivate).length}
            </div>
            <div className="text-sm text-gray-400">Public Rooms</div>
          </GlassPanel>
        </motion.div>
        
        {/* Rooms Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinRoom}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlassPanel className="p-8 max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No rooms found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search.' : 'Be the first to create a room!'}
              </p>
              <GlassButton
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-500/30 hover:bg-blue-500/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </GlassButton>
            </GlassPanel>
          </motion.div>
        )}
        
        {/* Create Room Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateRoomModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateRoom}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MultiplayerLobbyScreen;