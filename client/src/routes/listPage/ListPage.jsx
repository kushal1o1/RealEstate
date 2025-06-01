import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useLoaderData, Await, useSearchParams } from "react-router-dom";
import { Suspense, useState } from "react";
import { useToast } from '../../context/ToastContext.jsx';
import { useEffect } from 'react';
import Loader from "../../components/loader/Loader";

function ListPage() {
  const data = useLoaderData();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    showToast('You can play around Map to get locations', 'success');
  }, [showToast]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter onSearch={handleSearch} />
          <Suspense fallback={<Loader message="Loading Posts..." />}>
            <Await
              resolve={data.postResponse}
              errorElement={<Loader message="Error loading posts" />}
            >
   
              {(postResponse) => (
                postResponse.data.length === 0 ? (
                  <div className='no-posts'>
                    <p>No posts found. Try a different search.
                    </p>
                  </div>
                ) : (
                postResponse.data.map(item => (
                  <Card key={item.id} item={item} />
                ))
              ))}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<Loader message="Loading Map..." />}>
          <Await
            resolve={data.postResponse}
            errorElement={<Loader message="Error loading map" />}
          >
            {(postResponse) => (
              <Map 
                data={postResponse.data} 
                searchQuery={searchQuery}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;