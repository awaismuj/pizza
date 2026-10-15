import { useDispatch } from "react-redux";
import { getUserData } from "../https";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const demoPreview = import.meta.env.DEV && import.meta.env.VITE_POS_DEMO === "true";

  useEffect(() => {
    if (location.pathname === "/poster-maker") {
      setIsLoading(false);
      return;
    }

    if (demoPreview) {
      dispatch(setUser({
        _id: "local-demo-admin",
        name: "Demo Admin",
        email: "demo@example.local",
        phone: "",
        role: "Admin",
      }));
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await getUserData();
        console.log(data);
        const { _id, name, email, phone, role } = data.data;
        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        dispatch(removeUser());
        navigate("/auth");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [demoPreview, dispatch, location.pathname, navigate]);

  return isLoading;
};

export default useLoadData;
