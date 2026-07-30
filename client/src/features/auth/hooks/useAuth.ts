import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { useCurrentUser } from "../authApi";
import {
  setUser,
  clearUser,
  finishInitializing,
} from "../authSlice";

export const useAuthInitializer = () => {
  const dispatch = useAppDispatch();

  const {
    data: user,
    isSuccess,
    isError,
    isLoading,
  } = useCurrentUser();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [dispatch, isSuccess, user]);

  useEffect(() => {
    if (isError) {
      dispatch(clearUser());
    }
  }, [dispatch, isError]);

  useEffect(() => {
    if (!isLoading && !isSuccess && !isError) {
      dispatch(finishInitializing());
    }
  }, [dispatch, isLoading, isSuccess, isError]);
};