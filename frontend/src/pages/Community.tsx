import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleDuckAvatar from '../components/SimpleDuckAvatar';
import { AvatarState } from '../components/LSEGlingAvatar';
import { RootState } from '../store';

interface Duck {
  id: number;
  state: AvatarState;
  x: number;
  y: number;
  isUser?: boolean;
  name?: string;
  division?: string;
}

interface Division {
  name: string;
  shortName: string;
  color: string;
  duckCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

function Community() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedState, setSelectedState] = useState<AvatarState | 'all'>('all');
  const [selectedDivision, setSelectedDivision] = useState<string | 'all'>('all');
  
  // Define divisions with duck distribution
  const divisions: Division[] = useMemo(() => [
    { name: 'Capital Markets', shortName: 'Trading & Execution', color: 'blue', duckCount: 15, x: 5, y: 5, width: 0, height: 0 },
    { name: 'Data & Analytics', shortName: 'Market Intelligence', color: 'green', duckCount: 12, x: 55, y: 5, width: 0, height: 0 },
    { name: 'Post Trade', shortName: 'Clearing & Settlement', color: 'purple', duckCount: 10, x: 5, y: 55, width: 0, height: 0 },
    { name: 'Technology', shortName: 'Infrastructure & Innovation', color: 'orange', duckCount: 10, x: 55, y: 55, width: 0, height: 0 },
    { name: 'LSEG Hub', shortName: 'Collaboration Space', color: 'indigo', duckCount: 8, x: 35, y: 35, width: 0, height: 0 },
  ], []);

  // Calculate division sizes based on duck count
  const divisionsWithSize = useMemo(() => {
    const totalDucks = divisions.reduce((sum, d) => sum + d.duckCount, 0);
    const baseSize = 30; // Base percentage size
    
    return divisions.map(div => {
      const proportion = div.duckCount / totalDucks;
      const size = baseSize + (proportion * 40); // Scale between 30-70%
      return {
        ...div,
        width: size,
        height: size * 0.8, // Slightly rectangular
      };
    });
  }, [divisions]);
  
  // Generate 55 ducks with specified distribution
  const ducks = useMemo(() => {
    const duckList: Duck[] = [];
    let id = 0;

    // Helper to generate random position within a division
    const randomPositionInDivision = (division: Division) => {
      const padding = 8; // Padding from division edges
      return {
        x: division.x + padding + Math.random() * (division.width - padding * 2),
        y: division.y + padding + Math.random() * (division.height - padding * 2),
      };
    };

    // Define state distribution for each division to ensure variety
    const stateDistribution = {
      'Capital Markets': { happy: 9, tired: 2, thirsty: 1, wet: 2, hungry: 1 }, // 15 total
      'Data & Analytics': { happy: 7, tired: 1, thirsty: 2, wet: 1, hungry: 1 }, // 12 total
      'Post Trade': { happy: 6, tired: 1, thirsty: 1, wet: 1, hungry: 1 }, // 10 total
      'Technology': { happy: 5, tired: 1, thirsty: 1, wet: 1, hungry: 2 }, // 10 total
      'LSEG Hub': { happy: 5, tired: 0, thirsty: 0, wet: 0, hungry: 2 }, // 8 total (user is 1 happy)
    };

    // Add user duck first in Capital Markets
    const userDivision = divisionsWithSize[0];
    duckList.push({ 
      id: id++, 
      state: 'happy', 
      ...randomPositionInDivision(userDivision),
      isUser: true,
      name: user?.name || 'You',
      division: userDivision.name
    });

    // Add ducks for each division with mixed states
    divisionsWithSize.forEach((division) => {
      const distribution = stateDistribution[division.name as keyof typeof stateDistribution];
      
      // Skip user duck count for Capital Markets (already added)
      const startCount = division.name === 'Capital Markets' ? 1 : 0;
      
      // Create array of states for this division
      const divisionStates: AvatarState[] = [
        ...Array(distribution.happy - (division.name === 'Capital Markets' ? 1 : 0)).fill('happy'),
        ...Array(distribution.tired).fill('tired'),
        ...Array(distribution.thirsty).fill('thirsty'),
        ...Array(distribution.wet).fill('wet'),
        ...Array(distribution.hungry).fill('hungry'),
      ];
      
      // Shuffle states for random distribution within division
      const shuffledStates = divisionStates.sort(() => Math.random() - 0.5);
      
      // Add ducks for this division
      shuffledStates.forEach((state) => {
        duckList.push({ 
          id: id++, 
          state,
          ...randomPositionInDivision(division),
          division: division.name
        });
      });
    });

    return duckList;
  }, [user?.name, divisionsWithSize]);

  const stats = {
    happy: ducks.filter(d => d.state === 'happy').length,
    tired: ducks.filter(d => d.state === 'tired').length,
    thirsty: ducks.filter(d => d.state === 'thirsty').length,
    wet: ducks.filter(d => d.state === 'wet').length,
    hungry: ducks.filter(d => d.state === 'hungry').length,
  };

  const totalDucks = ducks.length;

  // Filter ducks based on selected state and division
  const filteredDucks = useMemo(() => {
    let filtered = ducks;
    
    if (selectedState !== 'all') {
      filtered = filtered.filter(duck => duck.state === selectedState);
    }
    
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(duck => duck.division === selectedDivision);
    }
    
    return filtered;
  }, [ducks, selectedState, selectedDivision]);

  const handleStateClick = (state: AvatarState | 'all') => {
    setSelectedState(selectedState === state ? 'all' : state);
  };

  const handleDivisionClick = (division: string | 'all') => {
    setSelectedDivision(selectedDivision === division ? 'all' : division);
  };

  const getStateMessage = (state: AvatarState, isUser: boolean, name?: string) => {
    const prefix = isUser ? `${name}: ` : '';
    
    switch (state) {
      case 'happy':
        return `${prefix}Everything is great! 😊`;
      case 'tired':
        return `${prefix}Feeling sleepy and needs rest 😴`;
      case 'thirsty':
        return `${prefix}Really needs some water 💧`;
      case 'wet':
        return `${prefix}Got caught in the rain, needs shelter 🌧️`;
      case 'hungry':
        return `${prefix}Stomach is rumbling, needs food 🍞`;
      default:
        return `${prefix}Current mood: ${state}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LSEG Community Floor Map</h1>
          <p className="text-gray-600">
            Office floor with team member status - Total: {totalDucks} team members
            {(selectedState !== 'all' || selectedDivision !== 'all') && (
              <span className="ml-2 text-blue-600 font-semibold">
                (Showing {filteredDucks.length} 
                {selectedState !== 'all' && ` ${selectedState}`}
                {selectedDivision !== 'all' && ` in ${selectedDivision}`}
                {' '}- Click filters again to show all)
              </span>
            )}
          </p>
        </div>

        {/* Division Filters */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Division:</h3>
          <div className="flex flex-wrap gap-2">
            {divisionsWithSize.map((division) => {
              const colorClasses = {
                blue: 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100',
                green: 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100',
                purple: 'border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100',
                orange: 'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100',
                indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
              };
              
              return (
                <button
                  key={division.name}
                  onClick={() => handleDivisionClick(division.name)}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${
                    selectedDivision === division.name 
                      ? `ring-2 ring-offset-2 ${colorClasses[division.color as keyof typeof colorClasses]}` 
                      : `${colorClasses[division.color as keyof typeof colorClasses]}`
                  }`}
                >
                  {division.name} ({division.duckCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* State Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by State:</h3>
          <div className="grid grid-cols-5 gap-4">
          <button
            onClick={() => handleStateClick('happy')}
            className={`bg-white rounded-lg shadow p-4 border-l-4 border-green-500 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedState === 'happy' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.happy}</div>
            <div className="text-sm text-gray-600">😊 Happy</div>
          </button>
          <button
            onClick={() => handleStateClick('tired')}
            className={`bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedState === 'tired' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.tired}</div>
            <div className="text-sm text-gray-600">😴 Tired</div>
          </button>
          <button
            onClick={() => handleStateClick('thirsty')}
            className={`bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedState === 'thirsty' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.thirsty}</div>
            <div className="text-sm text-gray-600">💧 Thirsty</div>
          </button>
          <button
            onClick={() => handleStateClick('wet')}
            className={`bg-white rounded-lg shadow p-4 border-l-4 border-gray-500 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedState === 'wet' ? 'ring-2 ring-gray-500 bg-gray-50' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.wet}</div>
            <div className="text-sm text-gray-600">🌧️ Wet</div>
          </button>
          <button
            onClick={() => handleStateClick('hungry')}
            className={`bg-white rounded-lg shadow p-4 border-l-4 border-orange-500 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedState === 'hungry' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.hungry}</div>
            <div className="text-sm text-gray-600">🍞 Hungry</div>
          </button>
          </div>
        </div>

        {/* Floor Map with LSEG Divisions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div 
            className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden"
            style={{ 
              height: '800px',
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.03) 50px, rgba(0,0,0,0.03) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.03) 50px, rgba(0,0,0,0.03) 51px)
              `
            }}
          >
            {/* LSEG Divisions - Organic Pond Shapes */}
            {divisionsWithSize.map((division, index) => {
              const colorClasses = {
                blue: 'from-blue-100 to-blue-200 border-blue-400 text-blue-800',
                green: 'from-green-100 to-green-200 border-green-400 text-green-800',
                purple: 'from-purple-100 to-purple-200 border-purple-400 text-purple-800',
                orange: 'from-orange-100 to-orange-200 border-orange-400 text-orange-800',
                indigo: 'from-indigo-100 to-indigo-200 border-indigo-400 text-indigo-800',
              };
              
              // Create organic pond shape using border-radius
              const pondStyle = {
                left: `${division.x}%`,
                top: `${division.y}%`,
                width: `${division.width}%`,
                height: `${division.height}%`,
                borderRadius: `${40 + Math.random() * 20}% ${60 + Math.random() * 20}% ${50 + Math.random() * 20}% ${70 + Math.random() * 20}% / ${60 + Math.random() * 20}% ${40 + Math.random() * 20}% ${60 + Math.random() * 20}% ${40 + Math.random() * 20}%`,
              };
              
              return (
                <div
                  key={index}
                  className={`absolute bg-gradient-to-br ${colorClasses[division.color as keyof typeof colorClasses]} border-3 shadow-lg p-4 transition-all duration-300 ${
                    selectedDivision === division.name ? 'ring-4 ring-offset-2 ring-yellow-400 scale-105' : ''
                  }`}
                  style={pondStyle}
                >
                  <div className="text-sm font-bold mb-1">{division.name}</div>
                  <div className="text-xs opacity-75">{division.shortName}</div>
                  <div className="absolute bottom-3 right-3 bg-white bg-opacity-80 rounded-full px-3 py-1.5 text-xs font-bold shadow-md">
                    {division.duckCount} 🦆
                  </div>
                  
                  {/* Pond ripple effect */}
                  <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none" 
                       style={{
                         background: 'radial-gradient(circle at 30% 30%, white 0%, transparent 70%)',
                         borderRadius: pondStyle.borderRadius
                       }}>
                  </div>
                </div>
              );
            })}

            {/* Ducks */}
            {filteredDucks.map((duck) => (
              <div
                key={duck.id}
                className={`absolute transition-all duration-300 cursor-pointer group ${
                  duck.isUser 
                    ? 'z-20 scale-[2.5] hover:scale-[2.7]' 
                    : 'hover:scale-125 hover:z-30'
                } ${
                  (selectedState !== 'all' && duck.state !== selectedState) || 
                  (selectedDivision !== 'all' && duck.division !== selectedDivision)
                    ? 'opacity-30' 
                    : 'opacity-100'
                }`}
                style={{
                  left: `${duck.x}%`,
                  top: `${duck.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {duck.isUser && (
                  <>
                    {/* User indicator ring - double ring effect */}
                    <div className="absolute -inset-4 rounded-full border-4 border-blue-500 animate-pulse bg-blue-100 bg-opacity-30"></div>
                    <div className="absolute -inset-5 rounded-full border-2 border-blue-300 opacity-50"></div>
                    
                    {/* User label with gradient */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base px-4 py-2 rounded-full font-bold whitespace-nowrap shadow-xl border-2 border-white">
                      � {duck.name}
                    </div>
                    
                    {/* Sparkle effects */}
                    <div className="absolute -top-2 -left-2 text-yellow-400 text-xl animate-pulse">✨</div>
                    <div className="absolute -top-2 -right-2 text-yellow-400 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
                  </>
                )}
                
                {/* Hover tooltip with state */}
                <div className={`absolute ${duck.isUser ? '-top-14' : '-top-12'} left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg`}>
                  <div className="text-center">
                    <div className="text-xs font-bold mb-1 capitalize">State: {duck.state}</div>
                    <div className="text-xs mb-1">{getStateMessage(duck.state, duck.isUser || false, duck.name)}</div>
                    <div className="text-xs opacity-75 border-t border-gray-600 pt-1 mt-1">📍 {duck.division}</div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
                
                <SimpleDuckAvatar state={duck.state} size={duck.isUser ? 'large' : 'small'} />
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Happy - All good!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Tired - Needs rest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Thirsty - Needs hydration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Wet - Needs shelter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Hungry - Needs food</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
