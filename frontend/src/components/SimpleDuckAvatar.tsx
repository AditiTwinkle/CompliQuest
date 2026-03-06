import { AvatarState } from './LSEGlingAvatar';

interface SimpleDuckAvatarProps {
  state?: AvatarState;
  size?: 'small' | 'medium' | 'large';
}

function SimpleDuckAvatar({ state = 'happy', size = 'small' }: SimpleDuckAvatarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { width: '60px', height: '60px' };
      case 'large':
        return { width: '120px', height: '120px' };
      default:
        return { width: '80px', height: '80px' };
    }
  };

  const sizeStyles = getSizeClasses();
  const uniqueId = `duck-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center justify-center">
      <style>{`
        .${uniqueId} {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .${uniqueId} .simple-chick-body {
          width: 50px;
          height: 45px;
          background: linear-gradient(145deg, #fff176 0%, #ffee58 30%, #ffc107 100%);
          border-radius: 50%;
          position: relative;
          z-index: 5;
          box-shadow: inset -3px -3px 8px rgba(255,152,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.8);
        }

        .${uniqueId} .simple-chick-head {
          width: 40px;
          height: 38px;
          background: linear-gradient(145deg, #fff176 0%, #ffee58 30%, #ffc107 100%);
          border-radius: 50%;
          position: absolute;
          top: -23px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          box-shadow: inset -2px -2px 6px rgba(255,152,0,0.3), inset 2px 2px 6px rgba(255,255,255,0.8);
        }

        .${uniqueId} .simple-chick-eyes {
          position: absolute;
          top: 11px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 9px;
        }

        .${uniqueId} .simple-chick-eye {
          width: 10px;
          height: 12px;
          background: linear-gradient(180deg, #333 0%, #000 100%);
          border-radius: 50%;
          position: relative;
          transition: all 0.3s ease;
        }

        .${uniqueId}.state-tired .simple-chick-eye {
          height: 4px;
          transform: scaleY(0.3);
        }

        .${uniqueId} .simple-chick-eye::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
        }

        .${uniqueId}.state-tired .simple-chick-eye::before {
          top: 0px;
        }

        /* Tears for thirsty state */
        .${uniqueId}.state-thirsty .simple-chick-head::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 8px;
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          left: 15px;
          top: 25px;
          animation: tearDrop-${uniqueId} 2s ease-in-out infinite;
        }

        .${uniqueId}.state-thirsty .simple-chick-head::before {
          content: '';
          position: absolute;
          width: 3px;
          height: 8px;
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          right: 15px;
          top: 25px;
          animation: tearDrop-${uniqueId} 2s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes tearDrop-${uniqueId} {
          0% { opacity: 0; transform: translateY(-2px); }
          50% { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(8px); }
        }

        .${uniqueId} .simple-chick-beak {
          position: absolute;
          top: 21px;
          left: 50%;
          transform: translateX(-50%);
        }

        .${uniqueId} .simple-chick-beak-top {
          width: 8px;
          height: 5px;
          background: linear-gradient(180deg, #ff9800 0%, #ff7043 100%);
          border-radius: 50% 50% 40% 40%;
          margin-left: -4px;
        }

        .${uniqueId} .simple-chick-beak-bottom {
          width: 6px;
          height: 3px;
          background: #ff7043;
          border-radius: 0 0 50% 50%;
          margin-left: -3px;
          margin-top: -1px;
        }

        .${uniqueId} .simple-chick-wing {
          width: 14px;
          height: 20px;
          background: linear-gradient(145deg, #fff176 0%, #ffc107 100%);
          border-radius: 50%;
          position: absolute;
          top: 13px;
          transform-origin: top center;
          box-shadow: inset -1px -1px 4px rgba(255,152,0,0.3);
        }

        .${uniqueId} .simple-chick-wing-left {
          left: -6px;
          transform: rotate(-15deg);
        }

        .${uniqueId} .simple-chick-wing-right {
          right: -6px;
          transform: rotate(15deg);
        }

        .${uniqueId} .simple-chick-feet {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 13px;
        }

        .${uniqueId} .simple-chick-foot {
          width: 11px;
          height: 6px;
          background: linear-gradient(180deg, #ff9800 0%, #ff7043 100%);
          border-radius: 50%;
        }

        /* State-specific animations */
        .${uniqueId}.state-happy {
          animation: simpleHappyBounce-${uniqueId} 0.6s ease-in-out infinite;
        }

        .${uniqueId}.state-hungry {
          animation: simpleHungryHop-${uniqueId} 1.5s ease-in-out infinite;
        }

        .${uniqueId}.state-hungry .simple-chick-body {
          animation: simpleStomachGrumble-${uniqueId} 1.5s ease-in-out infinite;
        }

        /* Rumble lines for hungry state */
        .${uniqueId}.state-hungry .rumble-lines {
          display: block;
        }

        .${uniqueId} .rumble-lines {
          display: none;
          position: absolute;
          width: 140%;
          height: 100%;
          left: -20%;
          top: 0;
          pointer-events: none;
        }

        .${uniqueId} .rumble-line {
          position: absolute;
          width: 8px;
          height: 2px;
          background: #ff9800;
          border-radius: 2px;
          opacity: 0;
          animation: rumblePulse-${uniqueId} 1.5s ease-in-out infinite;
        }

        .${uniqueId} .rumble-line:nth-child(1) { left: -3px; top: 40%; transform: rotate(-20deg); animation-delay: 0.5s; }
        .${uniqueId} .rumble-line:nth-child(2) { left: -5px; top: 55%; transform: rotate(10deg); animation-delay: 0.6s; }
        .${uniqueId} .rumble-line:nth-child(3) { right: -3px; top: 40%; transform: rotate(20deg); animation-delay: 0.55s; }
        .${uniqueId} .rumble-line:nth-child(4) { right: -5px; top: 55%; transform: rotate(-10deg); animation-delay: 0.65s; }

        @keyframes rumblePulse-${uniqueId} {
          0%, 40%, 80%, 100% { opacity: 0; transform: translateX(0) scaleX(1); }
          50% { opacity: 0.8; transform: translateX(-2px) scaleX(1.3); }
          60% { opacity: 0.5; transform: translateX(1px) scaleX(0.8); }
          70% { opacity: 0.3; transform: translateX(-1px) scaleX(1); }
        }

        /* Food particles for hungry state */
        .${uniqueId}.state-hungry .food-particles {
          display: block;
        }

        .${uniqueId} .food-particles {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .${uniqueId} .food-particle {
          position: absolute;
          font-size: 12px;
          opacity: 0;
          animation: foodFloat-${uniqueId} 2.5s ease-out infinite;
        }

        @keyframes foodFloat-${uniqueId} {
          0% { opacity: 0.9; transform: translateY(0) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.6) rotate(15deg); }
        }

        .${uniqueId}.state-thirsty {
          animation: simpleSadSway-${uniqueId} 3s ease-in-out infinite;
        }

        .${uniqueId}.state-tired {
          animation: simpleTiredSway-${uniqueId} 4s ease-in-out infinite;
        }

        .${uniqueId}.state-wet {
          animation: simpleWetShake-${uniqueId} 0.4s ease-in-out infinite;
        }

        @keyframes simpleHappyBounce-${uniqueId} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes simpleHungryHop-${uniqueId} {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-3px) rotate(-1deg); }
          40% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes simpleStomachGrumble-${uniqueId} {
          0%, 45%, 80%, 100% { transform: scale(1); border-radius: 50%; }
          50% { transform: scale(1.06, 0.96); border-radius: 48%; }
          55% { transform: scale(0.97, 1.04); border-radius: 50%; }
          60% { transform: scale(1.04, 0.97); border-radius: 49%; }
          65% { transform: scale(0.98, 1.03); border-radius: 50%; }
          70% { transform: scale(1.02, 0.99); border-radius: 50%; }
        }

        @keyframes simpleSadSway-${uniqueId} {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(2px) rotate(-2deg); }
        }

        @keyframes simpleTiredSway-${uniqueId} {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(3px) rotate(2deg); }
        }

        @keyframes simpleWetShake-${uniqueId} {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-2px) rotate(-3deg); }
          75% { transform: translateX(2px) rotate(3deg); }
        }
      `}</style>

      <div
        className={`${uniqueId} state-${state}`}
        style={sizeStyles}
      >
        {/* Food particles for hungry state */}
        <div className="food-particles">
          <div className="food-particle" style={{ left: '20%', top: '30%', animationDelay: '0s' }}>🍗</div>
          <div className="food-particle" style={{ left: '70%', top: '35%', animationDelay: '0.8s' }}>🍔</div>
          <div className="food-particle" style={{ left: '45%', top: '25%', animationDelay: '1.6s' }}>🍕</div>
        </div>

        <div className="simple-chick-body">
          <div className="simple-chick-head">
            <div className="simple-chick-eyes">
              <div className="simple-chick-eye"></div>
              <div className="simple-chick-eye"></div>
            </div>
            <div className="simple-chick-beak">
              <div className="simple-chick-beak-top"></div>
              <div className="simple-chick-beak-bottom"></div>
            </div>
          </div>
          
          <div className="simple-chick-wing simple-chick-wing-left"></div>
          <div className="simple-chick-wing simple-chick-wing-right"></div>
          
          {/* Rumble lines for hungry state */}
          <div className="rumble-lines">
            <div className="rumble-line"></div>
            <div className="rumble-line"></div>
            <div className="rumble-line"></div>
            <div className="rumble-line"></div>
          </div>
          
          <div className="simple-chick-feet">
            <div className="simple-chick-foot"></div>
            <div className="simple-chick-foot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDuckAvatar;
