import { useState, useEffect } from 'react';

export type AvatarState = 'happy' | 'hungry' | 'thirsty' | 'tired' | 'wet';

interface LSEGlingAvatarProps {
  state?: AvatarState;
  states?: AvatarState[]; // Support multiple states
  showBadge?: boolean;
  badgeText?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

function LSEGlingAvatar({
  state = 'happy',
  states,
  showBadge = false,
  badgeText = '',
  onClick,
  size = 'medium',
}: LSEGlingAvatarProps) {
  const [currentStates, setCurrentStates] = useState<AvatarState[]>(states || [state]);

  useEffect(() => {
    if (states && states.length > 0) {
      setCurrentStates(states);
    } else {
      setCurrentStates([state]);
    }
  }, [state, states]);
  
  // Check if specific states are active
  const isWet = currentStates.includes('wet');
  const isThirsty = currentStates.includes('thirsty');

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { width: '200px', height: '200px' };
      case 'large':
        return { width: '400px', height: '400px' };
      default:
        return { width: '300px', height: '300px' };
    }
  };

  const getBackgroundGradient = () => {
    if (isWet) {
      return 'linear-gradient(180deg, #4a5568 0%, #718096 40%, #a0aec0 70%, #8a9a5b 100%)';
    }
    return 'linear-gradient(180deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)';
  };

  // Build CSS class string for multiple states
  const getContainerClasses = () => {
    const classes = ['avatar-container'];
    currentStates.forEach(s => classes.push(`avatar-container-${s}`));
    return classes.join(' ');
  };

  const sizeStyles = getSizeClasses();

  return (
    <div className="flex flex-col items-center gap-4">
      <style>{`
        .avatar-container {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: ${getBackgroundGradient()};
          transition: background 0.8s ease;
        }

        /* Chick body parts */
        .chick-body {
          width: 100px;
          height: 90px;
          background: linear-gradient(145deg, #fff176 0%, #ffee58 30%, #ffc107 100%);
          border-radius: 50%;
          position: relative;
          z-index: 5;
          box-shadow: inset -5px -5px 15px rgba(255,152,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.8);
        }

        .chick-body::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%);
        }

        .chick-head {
          width: 80px;
          height: 75px;
          background: linear-gradient(145deg, #fff176 0%, #ffee58 30%, #ffc107 100%);
          border-radius: 50%;
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          box-shadow: inset -4px -4px 12px rgba(255,152,0,0.3), inset 4px 4px 12px rgba(255,255,255,0.8);
        }

        .chick-head::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 40%);
        }

        .chick-eyes {
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 18px;
        }

        .chick-eye {
          width: 20px;
          height: 24px;
          background: linear-gradient(180deg, #333 0%, #000 100%);
          border-radius: 50%;
          position: relative;
          animation: gentleBlink 4s ease-in-out infinite;
        }

        .chick-eye::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 4px;
          left: 4px;
        }

        .chick-eye::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          top: 12px;
          right: 4px;
          opacity: 0.7;
        }

        @keyframes gentleBlink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }

        .chick-beak {
          position: absolute;
          top: 42px;
          left: 50%;
          transform: translateX(-50%);
        }

        .chick-beak-top {
          width: 16px;
          height: 10px;
          background: linear-gradient(180deg, #ff9800 0%, #ff7043 100%);
          border-radius: 50% 50% 40% 40%;
          margin-left: -8px;
        }

        .chick-beak-bottom {
          width: 12px;
          height: 6px;
          background: #ff7043;
          border-radius: 0 0 50% 50%;
          margin-left: -6px;
          margin-top: -2px;
        }

        .chick-cheek {
          width: 14px;
          height: 8px;
          background: radial-gradient(ellipse, #ffab91 0%, transparent 70%);
          border-radius: 50%;
          position: absolute;
          top: 38px;
        }

        .chick-cheek-left { left: 6px; }
        .chick-cheek-right { right: 6px; }

        .chick-wing {
          width: 28px;
          height: 40px;
          background: linear-gradient(145deg, #fff176 0%, #ffc107 100%);
          border-radius: 50%;
          position: absolute;
          top: 25px;
          transform-origin: top center;
          box-shadow: inset -2px -2px 8px rgba(255,152,0,0.3);
        }

        .chick-wing-left {
          left: -12px;
          transform: rotate(-15deg);
        }

        .chick-wing-right {
          right: -12px;
          transform: rotate(15deg);
        }

        .chick-feet {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 25px;
        }

        .chick-foot {
          width: 22px;
          height: 12px;
          background: linear-gradient(180deg, #ff9800 0%, #ff7043 100%);
          border-radius: 50%;
        }

        .chick-tail {
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
        }

        .chick-tail-feather {
          width: 6px;
          height: 18px;
          background: linear-gradient(180deg, #fff176 0%, #ffc107 100%);
          border-radius: 50%;
          position: absolute;
          transform-origin: bottom center;
        }

        .chick-tail-feather:nth-child(1) { transform: rotate(-15deg); left: -5px; }
        .chick-tail-feather:nth-child(2) { transform: rotate(0deg); left: 0; }
        .chick-tail-feather:nth-child(3) { transform: rotate(15deg); left: 5px; }

        /* Chick container */
        .chick-container {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
        }

        /* Animations */
        @keyframes happyBounce {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
          50% { transform: translateX(-50%) translateY(-20px) scale(1.05); }
        }

        @keyframes happyHead {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-8deg); }
          75% { transform: translateX(-50%) rotate(8deg); }
        }

        @keyframes happyWingLeft {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-50deg) translateY(-5px); }
        }

        @keyframes happyWingRight {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(50deg) translateY(-5px); }
        }

        @keyframes happyEyes {
          0%, 40%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }

        @keyframes happyCheeks {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes hungryHop {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          20% { transform: translateX(-50%) translateY(-5px) rotate(-1deg); }
          40% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          55% { transform: translateX(-50%) translateY(2px) rotate(0deg); }
          60% { transform: translateX(-50%) translateY(-2px) rotate(1deg); }
          65% { transform: translateX(-50%) translateY(2px) rotate(-1deg); }
          75% { transform: translateX(-50%) translateY(0) rotate(0deg); }
        }

        @keyframes hungryLookDown {
          0%, 40%, 100% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(10deg) translateY(3px); }
          70% { transform: translateX(-50%) rotate(5deg) translateY(1px); }
        }

        @keyframes hungryWiggle {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-25deg); }
        }

        @keyframes stomachGrumble {
          0%, 45%, 80%, 100% { transform: scale(1); border-radius: 50%; }
          50% { transform: scale(1.06, 0.96); border-radius: 48%; }
          55% { transform: scale(0.97, 1.04); border-radius: 50%; }
          60% { transform: scale(1.04, 0.97); border-radius: 49%; }
          65% { transform: scale(0.98, 1.03); border-radius: 50%; }
          70% { transform: scale(1.02, 0.99); border-radius: 50%; }
        }

        @keyframes thirstySadSway {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(4px) rotate(-2deg); }
        }

        @keyframes thirstySadHead {
          0%, 100% { transform: translateX(-50%) rotate(-5deg) translateY(2px); }
          50% { transform: translateX(-50%) rotate(-8deg) translateY(5px); }
        }

        @keyframes sadEyes {
          0%, 100% { transform: scaleY(0.6) scaleX(1) translateY(2px); }
          50% { transform: scaleY(0.5) scaleX(1.05) translateY(3px); }
        }

        @keyframes sadDroop {
          0%, 100% { transform: rotate(-5deg) translateY(8px); }
          50% { transform: rotate(-2deg) translateY(10px); }
        }

        @keyframes tearFall {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          10% { opacity: 0.9; transform: translateY(0) scale(1); }
          90% { opacity: 0.6; transform: translateY(30px) scale(0.8); }
          100% { opacity: 0; transform: translateY(35px) scale(0.3); }
        }

        @keyframes tiredSway {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(5px) rotate(2deg); }
        }

        @keyframes tiredNod {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(3deg); }
          50% { transform: translateX(-50%) rotate(8deg) translateY(3px); }
          75% { transform: translateX(-50%) rotate(3deg); }
        }

        @keyframes sleepyEyes {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(0.15); }
        }

        @keyframes tiredDroop {
          0%, 100% { transform: rotate(-15deg) translateY(0); }
          50% { transform: rotate(-5deg) translateY(5px); }
        }

        @keyframes wetShake {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-52%) translateY(-3px) rotate(-3deg); }
          75% { transform: translateX(-48%) translateY(-3px) rotate(3deg); }
        }

        @keyframes wetHead {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-5deg); }
          75% { transform: translateX(-50%) rotate(5deg); }
        }

        @keyframes wetFlapLeft {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-40deg); }
        }

        @keyframes wetFlapRight {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(40deg); }
        }

        @keyframes dropFloat {
          0% { opacity: 0.9; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(40px) rotate(20deg) scale(0.5); }
        }

        /* Happy state animations */
        .avatar-container-happy .chick-container { animation: happyBounce 0.6s ease-in-out infinite; }
        .avatar-container-happy .chick-head { animation: happyHead 0.6s ease-in-out infinite; }
        .avatar-container-happy .chick-wing-left { animation: happyWingLeft 0.3s ease-in-out infinite; }
        .avatar-container-happy .chick-wing-right { animation: happyWingRight 0.3s ease-in-out infinite; }
        .avatar-container-happy .chick-eye { animation: happyEyes 0.6s ease-in-out infinite; }
        .avatar-container-happy .chick-cheek { animation: happyCheeks 0.6s ease-in-out infinite; }

        /* Hungry state animations */
        .avatar-container-hungry .chick-container { animation: hungryHop 1.5s ease-in-out infinite; }
        .avatar-container-hungry .chick-head { animation: hungryLookDown 2s ease-in-out infinite; }
        .avatar-container-hungry .chick-wing { animation: hungryWiggle 0.6s ease-in-out infinite; }
        .avatar-container-hungry .chick-body { animation: stomachGrumble 1.5s ease-in-out infinite; }

        /* Thirsty state animations */
        .avatar-container-thirsty .chick-container { animation: thirstySadSway 3s ease-in-out infinite; }
        .avatar-container-thirsty .chick-head { animation: thirstySadHead 3s ease-in-out infinite; }
        .avatar-container-thirsty .chick-eye { animation: sadEyes 3s ease-in-out infinite; }
        .avatar-container-thirsty .chick-wing { animation: sadDroop 3s ease-in-out infinite; }
        .avatar-container-thirsty .chick-cheek { opacity: 0.3; }

        /* Tired state animations */
        .avatar-container-tired .chick-container { animation: tiredSway 4s ease-in-out infinite; }
        .avatar-container-tired .chick-head { animation: tiredNod 4s ease-in-out infinite; }
        .avatar-container-tired .chick-eye { animation: sleepyEyes 4s ease-in-out infinite; }
        .avatar-container-tired .chick-wing { animation: tiredDroop 4s ease-in-out infinite; }

        /* Wet state animations */
        .avatar-container-wet .chick-container { animation: wetShake 0.4s ease-in-out infinite; }
        .avatar-container-wet .chick-head { animation: wetHead 0.4s ease-in-out infinite; }
        .avatar-container-wet .chick-wing-left { animation: wetFlapLeft 0.2s ease-in-out infinite; }
        .avatar-container-wet .chick-wing-right { animation: wetFlapRight 0.2s ease-in-out infinite; }

        @keyframes cloudDrift {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(calc(100% + 20px)); }
        }

        .cloud-float { animation: cloudDrift 30s linear infinite; }

        @keyframes rainFall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        .raindrop-fall { animation: rainFall 1s linear infinite; }

        .ground-grass {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 60px;
          background: ${isWet ? 'linear-gradient(180deg, #6b8a5a 0%, #5a7a4e 100%)' : 'linear-gradient(180deg, #98d977 0%, #7cb868 100%)'};
          border-radius: 100% 100% 0 0;
          transition: background 0.8s ease;
        }
      `}</style>

      <div
        className={getContainerClasses()}
        style={sizeStyles}
        onClick={onClick}
      >
        {/* Clouds */}
        <div className="absolute top-0 left-0 w-full h-1/3 overflow-hidden pointer-events-none">
          <div 
            className="cloud-float absolute w-16 h-6 rounded-full opacity-70"
            style={{ 
              background: isWet ? 'rgba(80, 80, 100, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              top: '10%',
              animationDelay: '0s'
            }}
          />
          <div 
            className="cloud-float absolute w-20 h-7 rounded-full opacity-60"
            style={{ 
              background: isWet ? 'rgba(80, 80, 100, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              top: '25%',
              animationDelay: '-10s'
            }}
          />
        </div>

        {/* Rain */}
        {isWet && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="raindrop-fall absolute w-0.5 h-3 bg-gradient-to-b from-transparent to-blue-300"
                style={{
                  left: `${(i * 7) % 100}%`,
                  animationDelay: `${(i * 0.1) % 1}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}

        {/* Chick */}
        <div className="chick-container">
          {/* Water drops for wet state */}
          {isWet && (
            <div className="absolute w-full h-full pointer-events-none" style={{ left: '-25%', top: '-50%', width: '150%', height: '150%' }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2.5 rounded-full bg-gradient-to-b from-blue-300 to-blue-400"
                  style={{
                    left: `${25 + i * 15}%`,
                    top: `${20 + i * 5}%`,
                    animation: `dropFloat 1s ease-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="chick-head">
            <div className="chick-eyes">
              <div className="chick-eye"></div>
              <div className="chick-eye"></div>
            </div>
            <div className="chick-cheek chick-cheek-left"></div>
            <div className="chick-cheek chick-cheek-right"></div>
            <div className="chick-beak">
              <div className="chick-beak-top"></div>
              <div className="chick-beak-bottom"></div>
            </div>
            
            {/* Tears for thirsty state */}
            {isThirsty && (
              <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
                <div 
                  className="absolute w-1.5 h-2 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full"
                  style={{
                    left: '18px',
                    top: '35px',
                    animation: 'tearFall 2s ease-in infinite',
                  }}
                />
                <div 
                  className="absolute w-1.5 h-2 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full"
                  style={{
                    right: '18px',
                    top: '35px',
                    animation: 'tearFall 2s ease-in infinite',
                    animationDelay: '1s',
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="chick-body">
            <div className="chick-wing chick-wing-left"></div>
            <div className="chick-wing chick-wing-right"></div>
          </div>
          
          <div className="chick-tail">
            <div className="chick-tail-feather"></div>
            <div className="chick-tail-feather"></div>
            <div className="chick-tail-feather"></div>
          </div>
          
          <div className="chick-feet">
            <div className="chick-foot"></div>
            <div className="chick-foot"></div>
          </div>
        </div>

        {/* Ground */}
        <div className="ground-grass">
          {!isWet && (
            <>
              <span className="absolute left-[15%] bottom-[60%] text-2xl">🌸</span>
              <span className="absolute right-[20%] bottom-[60%] text-2xl">🌼</span>
              <span className="absolute left-[40%] bottom-[40%] text-xl">🌷</span>
            </>
          )}
        </div>

        {/* Badge */}
        {showBadge && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg z-20">
            ✓
          </div>
        )}
      </div>

      {badgeText && <p className="text-sm font-medium text-gray-700">{badgeText}</p>}
    </div>
  );
}

export { LSEGlingAvatar };
export default LSEGlingAvatar;
