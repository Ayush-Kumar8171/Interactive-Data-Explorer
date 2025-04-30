import React from 'react';

const typeColors = {
  normal: 'bg-gray-300 text-gray-800',
  fire: 'bg-red-400 text-white',
  water: 'bg-blue-400 text-white',
  electric: 'bg-yellow-300 text-gray-800',
  grass: 'bg-green-400 text-white',
  ice: 'bg-blue-200 text-blue-800',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-300 text-indigo-900',
  psychic: 'bg-pink-400 text-white',
  bug: 'bg-green-700 text-white',
  rock: 'bg-yellow-800 text-white',
  ghost: 'bg-indigo-700 text-white',
  dragon: 'bg-purple-800 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-800',
};

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="w-28 h-28 mb-3"
      />
      <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
      <p className="text-sm text-gray-600 mb-2">ID: #{pokemon.id}</p>
      <div className="flex space-x-2">
        {pokemon.types.map((typeInfo) => {
          const colorClass = typeColors[typeInfo.type.name] || 'bg-gray-300 text-gray-800';
          return (
            <span
              key={typeInfo.type.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}
            >
              {typeInfo.type.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonCard;
