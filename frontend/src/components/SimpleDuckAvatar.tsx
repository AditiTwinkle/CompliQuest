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
