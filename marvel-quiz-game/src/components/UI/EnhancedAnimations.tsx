import React, { useState, useEffect, useRef } from 'react';

export interface AnimationProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  repeat?: boolean | number;
}

export interface FadeProps extends AnimationProps {
  direction?: 'in' | 'out';
  from?: number;
  to?: number;
}

export interface SlideProps extends AnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export interface ScaleProps extends AnimationProps {
  from?: number;
  to?: number;
  origin?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export interface RotateProps extends AnimationProps {
  from?: number;
  to?: number;
  axis?: 'x' | 'y' | 'z';
}

export interface BounceProps extends AnimationProps {
  intensity?: 'low' | 'medium' | 'high';
  direction?: 'vertical' | 'horizontal';
}

export interface PulseProps extends AnimationProps {
  scale?: number;
  opacity?: number;
}

export interface ShakeProps extends AnimationProps {
  intensity?: 'low' | 'medium' | 'high';
  direction?: 'horizontal' | 'vertical' | 'both';
}

export interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export interface CountUpProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  onComplete?: () => void;
}

// Fade Animation
export const FadeAnimation: React.FC<FadeProps> = ({
  children,
  direction = 'in',
  from = 0,
  to = 1,
  duration = 500,
  delay = 0,
  easing = 'ease-out'
}) => {
  const [isVisible, setIsVisible] = useState(direction === 'out');
  const [opacity, setOpacity] = useState(direction === 'in' ? from : to);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setOpacity(direction === 'in' ? to : from);
    }, delay);

    return () => clearTimeout(timer);
  }, [direction, from, to, delay]);

  return (
    <div
      style={
        {
          opacity,
          transition: `opacity ${duration}ms ${easing}`,
          visibility: isVisible ? 'visible' : 'hidden'
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

// Slide Animation
export const SlideAnimation: React.FC<SlideProps> = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 500,
  delay = 0,
  easing = 'ease-out'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [transform, setTransform] = useState('');

  useEffect(() => {
    const getInitialTransform = () => {
      switch (direction) {
        case 'up':
          return `translateY(${distance}px)`;
        case 'down':
          return `translateY(-${distance}px)`;
        case 'left':
          return `translateX(${distance}px)`;
        case 'right':
          return `translateX(-${distance}px)`;
        default:
          return '';
      }
    };

    setTransform(getInitialTransform());

    const timer = setTimeout(() => {
      setIsVisible(true);
      setTransform('translate(0, 0)');
    }, delay);

    return () => clearTimeout(timer);
  }, [direction, distance, delay]);

  return (
    <div
      style={{
        transform,
        transition: `transform ${duration}ms ${easing}`,
        opacity: isVisible ? 1 : 0
      }}
    >
      {children}
    </div>
  );
};

// Scale Animation
export const ScaleAnimation: React.FC<ScaleProps> = ({
  children,
  from = 0,
  to = 1,
  origin = 'center',
  duration = 500,
  delay = 0,
  easing = 'ease-out'
}) => {
  const [scale, setScale] = useState(from);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScale(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [to, delay]);

  const transformOriginMap = {
    center: 'center center',
    top: 'center top',
    bottom: 'center bottom',
    left: 'left center',
    right: 'right center'
  };

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: transformOriginMap[origin],
        transition: `transform ${duration}ms ${easing}`
      }}
    >
      {children}
    </div>
  );
};

// Rotate Animation
export const RotateAnimation: React.FC<RotateProps> = ({
  children,
  from = 0,
  to = 360,
  axis = 'z',
  duration = 1000,
  delay = 0,
  easing = 'linear',
  repeat = false
}) => {
  const [rotation, setRotation] = useState(from);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRotation(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [to, delay]);

  const getTransform = () => {
    switch (axis) {
      case 'x':
        return `rotateX(${rotation}deg)`;
      case 'y':
        return `rotateY(${rotation}deg)`;
      case 'z':
      default:
        return `rotateZ(${rotation}deg)`;
    }
  };

  const iterationCount = repeat === true ? 'infinite' : typeof repeat === 'number' ? repeat : 1;

  return (
    <div
      style={{
        transform: getTransform(),
        transition: `transform ${duration}ms ${easing}`,
        animationIterationCount: iterationCount
      }}
    >
      {children}
    </div>
  );
};

// Bounce Animation
export const BounceAnimation: React.FC<BounceProps> = ({
  children,
  intensity = 'medium',
  direction = 'vertical',
  duration = 600,
  delay = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const intensityMap = {
    low: '5px',
    medium: '10px',
    high: '20px'
  };

  const bounceDistance = intensityMap[intensity];

  const animationName = direction === 'vertical' ? 'bounceVertical' : 'bounceHorizontal';

  return (
    <div
      className={isAnimating ? `animate-${animationName}` : ''}
      style={{
        '--bounce-distance': bounceDistance,
        animationDuration: `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Pulse Animation
export const PulseAnimation: React.FC<PulseProps> = ({
  children,
  scale = 1.05,
  opacity = 0.8,
  duration = 1000,
  delay = 0,
  repeat = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={isAnimating ? 'animate-pulse-custom' : ''}
      style={{
        '--pulse-scale': scale,
        '--pulse-opacity': opacity,
        animationDuration: `${duration}ms`,
        animationIterationCount: repeat ? 'infinite' : 1
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Shake Animation
export const ShakeAnimation: React.FC<ShakeProps> = ({
  children,
  intensity = 'medium',
  direction = 'horizontal',
  duration = 500,
  delay = 0
}) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShaking(true);
      
      const stopTimer = setTimeout(() => {
        setIsShaking(false);
      }, duration);

      return () => clearTimeout(stopTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  const intensityMap = {
    low: '2px',
    medium: '5px',
    high: '10px'
  };

  const shakeDistance = intensityMap[intensity];
  const animationName = `shake${direction.charAt(0).toUpperCase() + direction.slice(1)}`;

  return (
    <div
      className={isShaking ? `animate-${animationName}` : ''}
      style={{
        '--shake-distance': shakeDistance,
        animationDuration: `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Typewriter Effect
export const TypewriterEffect: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(cursor);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay + currentIndex * speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
      if (cursor) {
        // Blink cursor after completion
        const blinkTimer = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(blinkTimer);
      }
    }
  }, [currentIndex, text, speed, delay, onComplete, cursor]);

  return (
    <span>
      {displayText}
      {cursor && showCursor && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// Count Up Animation
export const CountUpAnimation: React.FC<CountUpProps> = ({
  from,
  to,
  duration = 1000,
  delay = 0,
  decimals = 0,
  onComplete
}) => {
  const [currentValue, setCurrentValue] = useState(from);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const value = from + (to - from) * easedProgress;
        setCurrentValue(value);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(to);
          if (onComplete) {
            onComplete();
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [from, to, duration, delay, onComplete]);

  return (
    <span>
      {currentValue.toFixed(decimals)}
    </span>
  );
};

// Stagger Animation Container
export interface StaggerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const StaggerAnimation: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 100,
  animationType = 'fade',
  direction = 'up'
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        const delay = index * staggerDelay;
        
        switch (animationType) {
          case 'slide':
            return (
              <SlideAnimation key={index} delay={delay} direction={direction}>
                {child}
              </SlideAnimation>
            );
          case 'scale':
            return (
              <ScaleAnimation key={index} delay={delay}>
                {child}
              </ScaleAnimation>
            );
          case 'fade':
          default:
            return (
              <FadeAnimation key={index} delay={delay}>
                {child}
              </FadeAnimation>
            );
        }
      })}
    </>
  );
};

// Parallax Effect
export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export const ParallaxEffect: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'vertical'
}) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        
        if (direction === 'vertical') {
          setOffset(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <div
      ref={elementRef}
      style={{
        transform: direction === 'vertical' 
          ? `translateY(${offset}px)` 
          : `translateX(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};

export default {
  FadeAnimation,
  SlideAnimation,
  ScaleAnimation,
  RotateAnimation,
  BounceAnimation,
  PulseAnimation,
  ShakeAnimation,
  TypewriterEffect,
  CountUpAnimation,
  StaggerAnimation,
  ParallaxEffect
};