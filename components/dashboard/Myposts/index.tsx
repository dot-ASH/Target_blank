"use client";

import React, { useState, useEffect, useCallback } from "react";
// import api from "../../data/api";
import moment from "moment";
import { AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import Link from "next/link";
import { useData } from "@/context/DataProvider";

const Mypost = () => {
  const { user, posts } = useData();
  const [myPost, setMyPost] = useState<Post[]>();

  const fetchPost = useCallback(async () => {
    const myposts = posts.filter((obj) => obj.postby === user?.id);
    setMyPost(myposts);
  }, [posts]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <section id="my-post">
      <div className="w-full">
        {myPost && myPost?.length > 0 ? (
          myPost?.map((el, index) => {
            return (
              <div key={index}>
                <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                  <div className="flex w-full">
                    <div className="flex flex-col justify-around w-full">
                      <div className="text-left py-[1rem]">
                        <button>
                          <Link href={`/posts/${el.id}`}>
                            <h1 className="font-bold">{el.title}</h1>
                          </Link>
                        </button>
                      </div>
                      <div className="text-left">
                        <p className="italic">
                          - {moment(el.date).format("MMM Do YY")}
                        </p>
                      </div>
                      <div className="text-left py-[1rem]">
                        <p className="">{el.description}</p>
                      </div>
                      <div className=" flex text-left py-[1rem] gap-[1.5rem]">
                        <div className="flex">
                          <button>
                            <AiOutlineStar className="text-[22px]" />
                          </button>{" "}
                          &nbsp;
                          <div> {el.reactcount}</div>
                        </div>
                        <div className="flex">
                          <button>
                            <BiComment className="text-[22px]" />
                          </button>{" "}
                          &nbsp;
                          <div> {el.commentcount}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <img
                        src={el.thumbimage}
                        className="h-[300px] w-[400px] object-cover rounded-[5px]"
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">No Post yet</div>
        )}
      </div>
    </section>
  );
};

export default Mypost;
