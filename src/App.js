import React, { useEffect, useState } from 'react';
import PokemonCard from './components/PokemonCard';

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch first 150 pokemon basic info
  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${POKEAPI_URL}/pokemon?limit=150`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Fetch detailed info for each pokemon
        const detailedPromises = data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        });
        const detailedPokemon = await Promise.all(detailedPromises);
        // Debug log to check data structure
        console.log('Detailed Pokemon:', detailedPokemon);
        setPokemonList(detailedPokemon);
        setFilteredPokemon(detailedPokemon);
      } catch (err) {
        console.error('Error fetching Pokémon data:', err);
        setError(`Failed to fetch Pokémon data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  // Fetch all pokemon types for filter dropdown
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${POKEAPI_URL}/type`);
        const data = await res.json();
        // Filter out non-official types (like shadow, unknown)
        const officialTypes = data.results.filter(
          (type) =>
            !['shadow', 'unknown'].includes(type.name)
        );
        setTypes(officialTypes);
      } catch {
        // silently fail, types filter will be empty
      }
    };
    fetchTypes();
  }, []);

  // Filter pokemon based on search term and selected type
  useEffect(() => {
    let filtered = pokemonList;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((typeInfo) => typeInfo.type.name === selectedType)
      );
    }

    console.log('Filtered Pokemon:', filtered);
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, pokemonList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-100 to-green-100">
      <header className="bg-red-600 text-white p-6 text-center text-3xl font-extrabold tracking-wide shadow-md">
        Interactive Data Explorer
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 md:mb-0 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-center text-lg font-semibold text-red-600 animate-pulse">
            Loading Pokémon...
          </p>
        )}
        {error && (
          <p className="text-center text-red-700 font-semibold bg-red-100 p-4 rounded-lg shadow-md">
            {error}
          </p>
        )}
        {!loading && !error && filteredPokemon.length === 0 && (
          <p className="text-center text-gray-700 text-lg font-medium">
            No Pokémon found.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-600 text-sm">
        Data sourced from <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">PokeAPI</a>
      </footer>
    </div>
  );
};

export default App;
