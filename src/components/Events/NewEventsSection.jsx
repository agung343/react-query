import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "../../utils/http.js";
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey:["events", {max: 3}], // to see if any update or available data 'events' // menampilkan maximal 3
    queryFn: ({signal, queryKey}) => fetchEvents({signal, ...queryKey[1]}), // queryKey[1] meneruskan property 'max'   
    staleTime: 1000, // how much time, to delay get/update data, default was 0
    // gcTime: how long data keep/store in cache, if time-up it will re get data
  })

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error?.info?.message || "Failed to fetch events."} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
