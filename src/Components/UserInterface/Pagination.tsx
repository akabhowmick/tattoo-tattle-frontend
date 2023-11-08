/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useAuthContext } from "../../providers/auth-provider";
import { useTattooRequestsContext } from "../../providers/tattoo-requests-provider";
import { useTattooTattleContext } from "../../providers/tattoo-provider";
import { Tattoo, TattooRequest } from "../../types/interface";
import { Instructions } from "./Instructions";
import { RequestCard } from "./RequestCard";
import { TattooCard } from "./TattooCard";

const tattooHelperString =
  "At the moment you have no tattoos to display in this section!";
function TattooItems({
  currentTattoos,
  userId,
}: {
  currentTattoos: Tattoo[];
  userId: number;
}) {
  return (
    <>
      {currentTattoos.length > 0 ? (
        <div className="tattoo-grid">
          {currentTattoos?.map((tattoo: Tattoo) => {
            if (tattoo) {
              return (
                <TattooCard
                  class="tattoo-card"
                  key={tattoo.id}
                  tattoo={tattoo}
                  userId={userId}
                />
              );
            }
          })}
        </div>
      ) : (
        <Instructions
          helperMessage={tattooHelperString}
          contentType={"Tattoos"}
        />
      )}
    </>
  );
}

const requestHelperString = "At the moment you have no requests!";
function RequestItems({ currentRequests }: { currentRequests: TattooRequest[] }) {
  return (
    <>
      {currentRequests.length > 0 ? (
        <div className="tattooRequest-grid">
          {currentRequests?.map((request) => {
            return (
              <RequestCard
                class="request-card"
                key={request.id}
                request={request}
              />
            );
          })}
        </div>
      ) : (
        <Instructions
          helperMessage={requestHelperString}
          contentType={"Requests"}
        />
      )}
    </>
  );
}

export const Pagination = ({ currentDisplay }: { currentDisplay: string }) => {
  const { user } = useAuthContext();
  const { tattooRequests } = useTattooRequestsContext();
  const { tattoos } = useTattooTattleContext();

  const items = currentDisplay === "tats" ? tattoos : tattooRequests;

  const itemsPerPage = 8; // can change to any number
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setItemOffset((selected * itemsPerPage) % tattoos.length);
    setCurrentPage(selected);
  };

  useEffect(() => {
    setItemOffset(0);
    setCurrentPage(0);
  }, [tattoos]);

  return (
    <div className="pagination">
      {currentDisplay === "tats" && (
        <TattooItems
          currentTattoos={currentItems as Tattoo[]}
          userId={user!.id!}
        />
      )}
      {currentDisplay === "reqs" && (
        <RequestItems currentRequests={currentItems as TattooRequest[]} />
      )}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        forcePage={currentPage > pageCount ? -1 : currentPage}
      />
    </div>
  );
};
