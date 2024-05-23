import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { getGenreList } from '../services/movieService';
import tw from 'tailwind-react-native-classnames'; // Import Tailwind CSS class names

interface GenreFilterProps {
  selectedGenres: string[];
  onSelectGenres: (selectedGenres: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onSelectGenres }) => {
  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    
    const fetchGenres = async () => {
      try {
        const genreList = await getGenreList();
        const genres = ['All', ...genreList.map((genre) => genre.name)];
        setAllGenres(genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <View style={tw`flex-row bg-gray-900 py-4`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4`}>
        {allGenres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[tw`${selectedGenres.includes(genre) ? 'bg-red-600' : 'bg-gray-800'} rounded-lg flex-row items-center px-4 py-2 mr-4`]}
            onPress={() => onSelectGenres([genre])}
          >
            <Text
              style={[tw`${selectedGenres.includes(genre) ? 'text-white font-bold' : 'text-gray-300'} text-base font-semibold`]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default GenreFilter;
