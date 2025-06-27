import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/searchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const search = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset: resetMovies,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchTerm.trim() || "",
      }),
    false
  );

  React.useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        await loadMovies();
      } else {
        resetMovies();
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image
                source={icons.logo}
                className="w-12 h-10 mb-5 mx-auto"
                resizeMode="contain"
              />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search for movies"
                value={searchTerm}
                onChangeText={(text: string) => setSearchTerm(text)}
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 py-3">
                {"Error: " + moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchTerm.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results For{" "}
                  <Text className="text-accent">{searchTerm}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View>
              <Text className="text-center text-gray-500">
                {searchTerm.trim()
                  ? `No results found for your search "${searchTerm}".`
                  : "Please enter a search term."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default search;
