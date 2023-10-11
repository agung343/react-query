import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import { queryClient, getSingleEvent, deleleEvent } from "../../utils/http.js";
import Header from "../Header.jsx";
import Modal from "../UI/Modal.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const [deleting, setDeleting] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  // queryKey: mengambil dari seluruh events dan specifik params.id
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => getSingleEvent({ signal, id: params.id }),
  });

  const { 
    mutate, 
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: errorDeleting 
  } = useMutation({
    mutationFn: deleleEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function startDelete() {
    setDeleting(true);
  }

  function cancelDelete() {
    setDeleting(false);
  }

  function confirmDeleteClick() {
    mutate({ id: params.id });
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load event"
          message={error.info?.message || "please try again later"}
        />
      </div>
    );
  }

  if (data) {
    const formatDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={startDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>

        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formatDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {deleting && (
        <Modal onClose={cancelDelete}>
          <h2>Are you sure to delete the event?</h2>
          <div className="form-actions">
            {isPendingDeletion ? <p>Deleting Event...</p> : (<>
               <button className="button-text" onClick={cancelDelete}>Cancel</button>
               <button className="button" onClick={confirmDeleteClick}>Delete</button>
            </>)}
           
          </div>
          {isErrorDeleting && <ErrorBlock title="Could not delete the event" message={errorDeleting.info?.message} />}
        </Modal>
      )}

      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}


