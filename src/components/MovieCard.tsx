import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollViewProps,
} from 'react-native';
import { getMoviesByYear, getGenreList } from '../services/movieService';
import tw from 'tailwind-react-native-classnames';

interface Movie {
  poster_path: string;
  title: string;
  vote_average: number;
}

const MovieCard: React.FC = () => {
  const [moviesByYear, setMoviesByYear] = useState<{ [key: number]: Array<Movie> }>({});
  const [currentYear, setCurrentYear] = useState<number>(2012);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView & ScrollViewProps>(null);

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [year, setYear] = useState(2021);
  const [page, setPage] = useState(1);

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const loadMovies = async (year: number, page: number, direction: 'next' | 'prev') => {
    try {
      setLoading(true);
      const loadedMovies = await getMoviesByYear(year, page, selectedGenre);

      setMoviesByYear((prevMoviesByYear) => {
        const updatedMoviesByYear = { ...prevMoviesByYear };
        updatedMoviesByYear[year] = [
          ...(updatedMoviesByYear[year] || []),
          ...loadedMovies.slice(0, 20),
        ];
        return updatedMoviesByYear;
      });

      if (direction === 'next') {
        setCurrentYear(year + 1);
      } else if (direction === 'prev' && currentYear > 2012) {
        setCurrentYear(year - 1);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollUp = debounce(() => {
    if (scrollViewRef.current) {
      const offsetY = scrollViewRef.current.contentOffset?.y;
      const layoutHeight = scrollViewRef.current.layoutMeasurement?.height;

      if (
        offsetY !== undefined &&
        layoutHeight !== undefined &&
        offsetY < layoutHeight * 2 &&
        currentYear > 2012 &&
        !loading
      ) {
        loadMovies(currentYear - 1, 1, 'prev');
      }
    }
  }, 500);

  const handleScrollDown = debounce(() => {
    if (scrollViewRef.current) {
      const offsetY = scrollViewRef.current.contentOffset?.y;
      const contentHeight = scrollViewRef.current.contentSize?.height;
      const layoutHeight = scrollViewRef.current.layoutMeasurement?.height;

      if (
        offsetY !== undefined &&
        contentHeight !== undefined &&
        layoutHeight !== undefined &&
        offsetY > contentHeight - layoutHeight * 2 &&
        !loading
      ) {
        loadMovies(
          currentYear,
          Math.ceil((moviesByYear[currentYear]?.length || 0) / 20) + 1,
          'next',
        );
      }
    }
  }, 500);

  useEffect(() => {
    loadMovies(currentYear, 1, 'next');
  }, [currentYear, selectedGenre]);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={tw`pt-2 pb-36 bg-gray-900`}
      onScroll={(event) => {
        handleScrollDown();
        handleScrollUp();
      }}
      scrollEventThrottle={400}
    >
      {Object.keys(moviesByYear).map((year) => (
        <View key={year} style={tw`px-4 mt-2`}>
          <Text style={tw`text-xl font-extrabold text-white`}>{year}</Text>
          <View style={tw`flex-row flex-wrap justify-between mt-2`}>
            {moviesByYear[Number(year)].map((movie, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  tw`mb-4 bg-gray-700 rounded-lg overflow-hidden`,
                  { width: '48%', height: 258 },
                ]}
              >
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
                <View style={tw`absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50`}>
                  <Text style={tw`text-sm font-bold text-white`}>{movie.title}</Text>
                  <Text style={tw`text-xs text-white`}>{`Ratings: ${movie.vote_average}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {loading && <ActivityIndicator style={tw`self-center my-2`} />}
    </ScrollView>
  );
};

export default MovieCard;
