import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../utils/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error} = useQuery({
    queryFn: ({signal}) => fetchEvents({signal,search}), // menerima signal dan search
    queryKey: ["events", {search: search }], // others than events, also need dynamic search
    enabled: search !== '', // query tidak mengirim data jika kondisi/behavior bernilai false
  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearch(searchElement.current.value)
  }

  let content = (
    <p>Please enter a search term and to fund events.</p>
  )

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = <ErrorBlock title="An error occured" message={error.info?.messae || "Failed fetch event"} />
  }

  if (data) {
    content =(<ul className='event-list'>
      {data.map(event => <li key={event.id}>
        <EventItem event={event} />
      </li>)}
    </ul>)
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
