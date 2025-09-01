import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './ImageOptimization';
import { CharacterImageGallery } from './CharacterImageGallery';
import { Clock, Zap, Eye, Image as ImageIcon, Info, Check, X } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  category?: string;
  type?: string;
  characterId?: number;
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
  onGalleryOpen,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  // Generate character-specific images based on question content
  const getCharacterImageUrl = (question: Question): string => {
    const questionText = question.question.toLowerCase();
    const characterId = question.characterId;

    // High-quality character images
    const characterImages: Record<string, string> = {
      'spider-man':
        'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'iron-man':
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      thor: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      hulk: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      'captain-america':
        'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'black-widow':
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      hawkeye:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
      'doctor-strange':
        'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop&q=85',
      'scarlet-witch':
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&q=85',
      vision:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=85',
    };

    // Try to match by character ID first
    if (characterId && characterImages[characterId]) {
      return characterImages[characterId];
    }

    // Try to match by question content
    for (const [character, imageUrl] of Object.entries(characterImages)) {
      if (
        questionText.includes(character.replace('-', ' ')) ||
        questionText.includes(character.replace('-', ''))
      ) {
        return imageUrl;
      }
    }

    // Default fallback image
    return (
      question.imageUrl ||
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop&q=85'
    );
  };

  const imageUrl = getCharacterImageUrl(question);
  const hasCharacterGallery = question.characterId && showGalleryButton;

  return (
    <div className={`relative ${className}`}>
      <div className='relative aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden'>
        <OptimizedImage
          src={imageUrl}
          alt={`${question.category || 'Marvel'} character image`}
          className='w-full h-full'
          preload={true}
          fallbackSrc='https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop&q=85'
        />

        {/* Image overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Question type badge */}
        {question.type && (
          <div className='absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium'>
            {question.type.replace('-', ' ').toUpperCase()}
          </div>
        )}

        {/* Difficulty indicator */}
        {question.difficulty && (
          <div
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${
              question.difficulty === 'easy'
                ? 'bg-green-500 text-white'
                : question.difficulty === 'medium'
                ? 'bg-yellow-500 text-black'
                : question.difficulty === 'hard'
                ? 'bg-orange-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {question.difficulty.toUpperCase()}
          </div>
        )}

        {/* Image actions */}
        <div className='absolute bottom-3 right-3 flex gap-2'>
          <button
            onClick={() => setShowImageModal(true)}
            className='p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors'
            title='View full image'
          >
            <Eye className='w-4 h-4' />
          </button>

          {hasCharacterGallery && onGalleryOpen && (
            <button
              onClick={onGalleryOpen}
              className='p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors'
              title='View character gallery'
            >
              <ImageIcon className='w-4 h-4' />
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
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
            onClick={() => setShowImageModal(false)}
          >
            <div className='relative max-w-4xl max-h-full' onClick={e => e.stopPropagation()}>
              <OptimizedImage
                src={imageUrl.replace('w=800&h=600', 'w=1920&h=1080')}
                alt={`${question.category || 'Marvel'} character image - full size`}
                className='max-w-full max-h-[90vh] object-contain rounded-lg'
              />
              <button
                onClick={() => setShowImageModal(false)}
                className='absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
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
  className = '',
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const getEnhancedOptionStyle = (option: string) => {
    if (!showResult) {
      if (hoveredOption === option) {
        return 'bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-lg shadow-blue-500/20';
      }
      return 'bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 hover:bg-white/15';
    }

    if (option === String(question.correctAnswer)) {
      return 'bg-green-500/20 backdrop-blur-md border-2 border-green-400/50 shadow-lg shadow-green-500/30';
    }

    if (option === selectedAnswer && option !== String(question.correctAnswer)) {
      return 'bg-red-500/20 backdrop-blur-md border-2 border-red-400/50 shadow-lg shadow-red-500/30';
    }

    return 'bg-white/10 backdrop-blur-md border-2 border-white/20';
  };

  const handleGalleryOpen = () => {
    if (question.characterId && onImageGallery) {
      onImageGallery(String(question.characterId));
    } else {
      setShowGallery(true);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto ${className}`}>
      {/* Modern Stats Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-6'>
            <div className='bg-white/20 rounded-xl px-4 py-2'>
              <span className='text-white/90 text-sm font-medium'>Question</span>
              <div className='text-2xl font-bold text-white'>
                {questionIndex + 1}
                <span className='text-white/60'>/{totalQuestions}</span>
              </div>
            </div>

            {streak > 0 && (
              <div className='bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl px-4 py-2 border border-orange-500/30'>
                <div className='flex items-center gap-2 text-orange-300'>
                  <Zap className='w-5 h-5' />
                  <span className='font-bold text-xl'>{streak}</span>
                  <span className='text-sm'>streak</span>
                </div>
              </div>
            )}

            <div className='bg-white/20 rounded-xl px-4 py-2'>
              <span className='text-white/90 text-sm font-medium'>Score</span>
              <div className='text-2xl font-bold text-white'>{score.toLocaleString()}</div>
            </div>
          </div>

          <div className='bg-white/20 rounded-xl px-4 py-2'>
            <div className='flex items-center gap-3'>
              <Clock className='w-5 h-5 text-white/80' />
              <span
                className={`text-2xl font-bold font-mono ${
                  timeLeft <= 10
                    ? 'text-red-400 animate-pulse'
                    : timeLeft <= 20
                    ? 'text-yellow-400'
                    : 'text-white'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Progress bar */}
        <div className='relative'>
          <div className='w-full bg-white/20 rounded-full h-3 overflow-hidden'>
            <motion.div
              className='bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-full rounded-full relative'
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className='absolute inset-0 bg-white/30 animate-pulse' />
            </motion.div>
          </div>
          <div className='text-center mt-2 text-white/80 text-sm font-medium'>
            {Math.round(progress)}% Complete
          </div>
        </div>
      </motion.div>

      {/* Question Image */}
      <QuestionImage question={question} className='mb-6' onGalleryOpen={handleGalleryOpen} />

      {/* Enhanced Question Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20'
      >
        <h2 className='text-3xl md:text-4xl font-bold text-white leading-tight mb-4'>
          {question.question}
        </h2>

        {question.category && (
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-200 text-sm px-4 py-2 rounded-full font-medium'>
            <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
            {question.category}
          </div>
        )}
      </motion.div>

      {/* Enhanced Answer Options */}
      <div className='grid gap-4 mb-8'>
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: 0.3 + index * 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !showResult && onAnswerSelect(option)}
            onMouseEnter={() => !showResult && setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption(null)}
            disabled={showResult}
            className={`group relative p-6 text-left rounded-2xl transition-all duration-300 transform ${getEnhancedOptionStyle(
              option
            )} ${
              !showResult ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
            } overflow-hidden`}
          >
            {/* Background gradient overlay */}
            <div
              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                !showResult ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : ''
              }`}
            />

            <div className='relative flex items-center gap-4 z-10'>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  showResult && option === question.correctAnswer
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : showResult && option === selectedAnswer && option !== question.correctAnswer
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : hoveredOption === option && !showResult
                    ? 'bg-gradient-to-br from-blue-400/40 to-purple-400/40 text-white border-2 border-white/50'
                    : 'bg-gradient-to-br from-blue-400/30 to-purple-400/30 text-white/90 border-2 border-white/30'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span
                className={`text-xl font-semibold transition-colors duration-300 leading-relaxed ${
                  showResult && option === String(question.correctAnswer)
                    ? 'text-green-100'
                    : showResult &&
                      option === selectedAnswer &&
                      option !== String(question.correctAnswer)
                    ? 'text-red-100'
                    : 'text-white'
                }`}
              >
                {option}
              </span>

              {/* Result indicator */}
              {showResult && option === String(question.correctAnswer) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='ml-auto w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'
                >
                  <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </motion.div>
              )}

              {showResult &&
                option === selectedAnswer &&
                option !== String(question.correctAnswer) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='ml-auto w-8 h-8 bg-red-500 rounded-full flex items-center justify-center'
                  >
                    <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </motion.div>
                )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Enhanced Explanation */}
      <AnimatePresence>
        {showResult && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-400/30 rounded-2xl p-6 shadow-lg'
          >
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0'>
                <Info className='w-6 h-6 text-blue-300' />
              </div>
              <div className='flex-1'>
                <h4 className='font-bold text-blue-200 mb-3 text-lg'>Did You Know?</h4>
                <p className='text-white/90 leading-relaxed text-lg'>{question.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Gallery Modal */}
      <AnimatePresence>
        {showGallery && question.characterId && (
          <CharacterImageGallery
            characterId={String(question.characterId)}
            characterName={`Character ${question.characterId}`}
            showModal={true}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedQuestionDisplay;
