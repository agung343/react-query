import { useQuery } from "@tanstack/react-query";
import { getSingleEvent, updateEvent, queryClient } from "../../utils/http.js";

import { Link, redirect, useNavigate, useParams, useSubmit} from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const submit = useSubmit()

  const { data, isError, error } = useQuery({
    queryFn: ({ signal }) => getSingleEvent({ signal, id: params.id }),
    queryKey: ["events", params.id],
    staleTime: 1000 * 10 // jika data yg baru yg didapatkan dari fungsi loader bertahan selama 10 detik, query tidak akan melakukan fetching ke cache (double request get)
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {  //optimistic mutate, update UI instant tanpa nunggu response dari backend, jika backend fail maka akan di rollback
  //     const newEvent = data.event
  //     await queryClient.cancelQueries({
  //       queryKey: ['events', params.id] //
  //     })
  //     const previousEvent = queryClient.getQueriesData(["events", params.id])
  //     queryClient.setQueriesData(['events', params.id], newEvent); // manipulate data yg disimpan di query

  //     return { previousEvent: previousEvent} // passing ke onError
  //   },
  //   onError: (error, data, context) => { // jika mutasi gagal, roll back ke data semula
  //     queryClient.setQueriesData(["events", params], context.previousEvent)
  //   },
  //   onSettled: () => { //apa yg akan dilakukan query, tidak peduli jika mutasi gagal atau berhasil --> paksa query untuk request get ke backend
  //     queryClient.invalidateQueries(["events", params.id])
  //   } 
  // })

  function handleSubmit(formData) {
    // mutate({id: params.id , event:formData})
    // navigate("../")

    submit(formData, {
      method: "PUT"
    })
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="could not get the event"
          message={error.info?.message}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <>
        <EventForm inputData={data} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      </>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
export function loader({params}) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({signal}) => getSingleEvent({signal, id: params.id})
  })
}

export function loader({params}) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({signal}) => getSingleEvent({signal, id: params.id})
  })
}

export async function action({request, params}) {
  const formData = await request.formData()
  const updatedData = Object.fromEntries(formData)
  await updateEvent({id: params.id, event: updatedData})

  await queryClient.invalidateQueries(["events"])
  return redirect("../")
}