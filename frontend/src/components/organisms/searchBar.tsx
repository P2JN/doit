import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";

import { searchService } from "services";

import { Search } from "@mui/icons-material";
import { paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import {
  ModalDrawer,
  GoalSearchResult,
  PostSearchResult,
  UserSearchResult,
} from "components/organisms";

const SearchBar = () => {
  const [params, setSearchParams] = useSearchParams();

  const {
    data: userResults,
    isLoading: loadingUsers,
    error: userError,
    hasNextPage: hasNextUserPage,
    fetchNextPage: fetchNextUserPage,
  } = searchService.useSearchUsers(params.get("q") || "");
  const users = useMemo(
    () => paginationUtils.combinePages(userResults),
    [userResults]
  );

  const {
    data: postResults,
    isLoading: loadingPosts,
    error: postError,
    hasNextPage: hasNextPostPage,
    fetchNextPage: fetchNextPostPage,
  } = searchService.useSearchPosts(params.get("q") || "");
  const posts = useMemo(
    () => paginationUtils.combinePages(postResults),
    [postResults]
  );

  const {
    data: goalResults,
    isLoading: loadingGoals,
    error: goalError,
    hasNextPage: hasNextGoalPage,
    fetchNextPage: fetchNextGoalPage,
  } = searchService.useSearchGoals(params.get("q") || "");
  const goals = useMemo(
    () => paginationUtils.combinePages(goalResults),
    [goalResults]
  );

  // debounced search
  const timer = useRef<NodeJS.Timeout>();
  const onSearch = (query: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setSearchParams({ q: query });
    }, 500);
  };

  return (
    <>
      <Button
        startIcon={<Search />}
        onClick={() => setSearchParams({ q: " " })}
        variant="outlined"
        color="primary"
        fullWidth
      >
        Buscar
      </Button>

      {!!params.get("q") && (
        <ModalDrawer title="Búsqueda" onClose={() => setSearchParams({})}>
          <div className="flex flex-col gap-3">
            <TextField
              name="search"
              onChange={(e) => onSearch(e.target.value)}
              InputProps={{
                endAdornment: <Search />,
              }}
              type="text"
              placeholder="Encuentra metas, usuarios o posts"
              fullWidth
            />
            <div>
              <Typography variant="h5">Goals</Typography>
              {loadingGoals ? (
                <Typography variant="body1">Cargando...</Typography>
              ) : (
                <div>
                  <ul>
                    {goals?.map((goal) => (
                      <li key={goal.id} className="my-1 border-t py-1">
                        <GoalSearchResult {...goal} />
                      </li>
                    ))}
                  </ul>
                  <DataLoader
                    isLoading={loadingGoals}
                    error={goalError}
                    hasNextPage={hasNextGoalPage}
                    loadMore={fetchNextGoalPage}
                    hasData={!!goals?.length}
                  />
                </div>
              )}
            </div>
            <div>
              <Typography variant="h5">Usuarios</Typography>
              {loadingUsers ? (
                <div>Cargando...</div>
              ) : (
                <div>
                  <ul>
                    {users?.map((user) => (
                      <li key={user.id} className="my-1 border-t py-1">
                        <UserSearchResult {...user} />
                      </li>
                    ))}
                  </ul>
                  <DataLoader
                    isLoading={loadingUsers}
                    hasNextPage={hasNextUserPage}
                    loadMore={fetchNextUserPage}
                    error={userError}
                    hasData={!!users?.length}
                  />
                </div>
              )}
            </div>
            <div>
              <Typography variant="h5">Posts</Typography>
              {loadingPosts ? (
                <Typography variant="body1">Cargando...</Typography>
              ) : (
                <div>
                  <ul>
                    {posts?.map((post) => (
                      <li key={post.id} className="my-1 border-t py-1">
                        <PostSearchResult {...post} />
                      </li>
                    ))}
                  </ul>
                  <DataLoader
                    isLoading={loadingPosts}
                    hasNextPage={hasNextPostPage}
                    loadMore={fetchNextPostPage}
                    error={postError}
                    hasData={!!posts?.length}
                  />
                </div>
              )}
            </div>
          </div>
        </ModalDrawer>
      )}
    </>
  );
};

export default SearchBar;
