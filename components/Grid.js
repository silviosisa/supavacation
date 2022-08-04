import PropTypes from "prop-types";
import Card from "@/components/Card";
import { ExclamationIcon } from "@heroicons/react/outline";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Grid = ({ homes = [] }) => {
  const router = useRouter();
  const isEmpty = homes.length === 0;

  const toggleFavorite = async (id, favorite) => {
    let toastId;
    if (favorite) {
      toastId = toast.loading("deleting");
      await axios.delete(`/api/${id}/favorites`);
      toast.success("Successfully deleted", { id: toastId });
      router.push("/");
    } else {
      toastId = toast.loading("Adding to favorites");
      await axios.delete(`/api/${id}/favorites`);
      toast.success("Successfully Added to favorites", { id: toastId });
      router.push("/favorites");
      await axios.put(`/api/${id}/favorites`);
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card key={home.id} {...home} onClickFavorite={toggleFavorite} />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;
