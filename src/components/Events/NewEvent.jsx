import { useMutation } from "@tanstack/react-query"; // sending post request
import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { postNewEvent, queryClient } from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: postNewEvent(), // tidak seperti request get, request post tidak perlu fungsi anonim
    
    // onSuccess => apa yg akan dilakukan query jika request post berhasil
    // queryClient.invalidateQuery => react query akan refresh get pada yg memiliki key 'events' jika ada add/delete
    // navigate => arahkan navigasi / link 
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"]
      }) 
      navigate("/events");
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData })
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting"}
        {!isPending && (
            <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (<ErrorBlock title="Failed to create event" 
        message={error.info?.message || "Please check input and try later"} />)
      }
    </Modal>
  );
}
