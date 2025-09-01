import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './ImageOptimization';
import { CharacterImageGallery } from './CharacterImageGallery';
import { Clock, Zap, Eye, Image as ImageIcon, Info } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  category?: string;
  type?: string;
  characterId?: string;
  timeLimit?: number;
}

interface EnhancedQuestionDisplayProps {
  question: Question;
  selectedAnswer: string;
  showResult: boolean;
  timeLeft: number;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSelect: (answer: string) => void;
  onImageGallery?: (characterId: string) => void;
  streak?: number;
  score?: number;
  powerUpsAvailable?: boolean;
  className?: string;
}

interface QuestionImageProps {
  question: Question;
  className?: string;
  showGalleryButton?: boolean;
  onGalleryOpen?: () => void;
}

// Enhanced Question Image Component
const QuestionImage: React.FC<QuestionImageProps> = ({
  question,
  className = '',
  showGalleryButton = true,
  onGalleryOpen
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Generate character-specific images based on question content
  const getCharacterImageUrl = (question: Question): string => {
    const questionText = question.question.toLowerCase();
    const characterId = question.characterId;
    
    // High-quality character images
    const characterImages: Record<string, string> = {
      'spider-man': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'iron-man': 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      'thor': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      'hulk': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      'captain-america': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'black-widow': 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      'hawkeye': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      'doctor-strange': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'scarlet-witch': 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      'vision': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85'
    };
    
    // Try to match by character ID first
    if (characterId && characterImages[characterId]) {
      return characterImages[characterId];
    }
    
    // Try to match by question content
    for (const [character, imageUrl] of Object.entries(characterImages)) {
      if (questionText.includes(character.replace('-', ' ')) || 
          questionText.includes(character.replace('-', ''))) {
        return imageUrl;
      }
    }
    
    // Default fallback image
    return question.imageUrl || 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop&q=85';
  };
  
  const imageUrl = getCharacterImageUrl(question);
  const hasCharacterGallery = question.characterId && showGalleryButton;
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={`${question.category || 'Marvel'} character image`}
          className="w-full h-full"
          preload={true}
          fallbackSrc="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop&q=85"
        />
        
        {/* Image overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Question type badge */}
        {question.type && (
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
            {question.type.replace('-', ' ').toUpperCase()}
          </div>
        )}
        
        {/* Difficulty indicator */}
        {question.difficulty && (
          <div className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${
            question.difficulty === 'easy' ? 'bg-green-500 text-white' :
            question.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
            question.difficulty === 'hard' ? 'bg-orange-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {question.difficulty.toUpperCase()}
          </div>
        )}
        
        {/* Image actions */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setShowImageModal(true)}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="View full image"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {hasCharacterGallery && onGalleryOpen && (
            <button
              onClick={onGalleryOpen}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              title="View character gallery"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Full image modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
              <OptimizedImage
                src={imageUrl.replace('w=800&h=600', 'w=1920&h=1080')}
                alt={`${question.category || 'Marvel'} character image - full size`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Enhanced Question Display Component
export const EnhancedQuestionDisplay: React.FC<EnhancedQuestionDisplayProps> = ({
  question,
  selectedAnswer,
  showResult,
  timeLeft,
  questionIndex,
  totalQuestions,
  onAnswerSelect,
  onImageGallery,
  streak = 0,
  score = 0,
  powerUpsAvailable = false,
  className = ''
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  
  const getOptionStyle = (option: string) => {
    if (!showResult) {
      if (hoveredOption === option) {
        return 'bg-blue-100 border-blue-300 transform scale-105';
      }
      return 'bg-white border-gray-200 hover:border-blue-300';
    }
    
    if (option === question.correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    
    return 'bg-gray-100 border-gray-300 text-gray-600';
  };
  
  const handleGalleryOpen = () => {
    if (question.characterId && onImageGallery) {
      onImageGallery(question.characterId);
    } else {
      setShowGallery(true);
    }
  };
  
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress and Stats Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Question {questionIndex + 1} of {totalQuestions}</span>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Zap className="w-4 h-4" />
                <span>{streak} streak</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>Score: {score}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className={`font-mono ${
              timeLeft <= 10 ? 'text-red-600 font-bold' : 
              timeLeft <= 20 ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Question Image */}
      <QuestionImage
        question={question}
        className="mb-6"
        onGalleryOpen={handleGalleryOpen}
      />
      
      {/* Question Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {question.question}
        </h2>
        
        {question.category && (
          <div className="mt-3 inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {question.category}
          </div>
        )}
      </motion.div>
      
      {/* Answer Options */}
      <div className="grid gap-4 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !showResult && onAnswerSelect(option)}
            onMouseEnter={() => !showResult && setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption(null)}
            disabled={showResult}
            className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
              getOptionStyle(option)
            } ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                showResult && option === question.correctAnswer
                  ? 'bg-green-500 border-green-500 text-white'
                  : showResult && option === selectedAnswer && option !== question.correctAnswer
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-400 text-gray-600'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Explanation */}
      <AnimatePresence>
        {showResult && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
                <p className="text-blue-700">{question.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Character Gallery Modal */}
      <AnimatePresence>
        {showGallery && question.characterId && (
          <CharacterImageGallery
            characterId={question.characterId}
            characterName={question.characterId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            showModal={true}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedQuestionDisplay;