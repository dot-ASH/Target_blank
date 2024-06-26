"use client";

import { useData } from "@/context/DataProvider";
import api from "@/data/api";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useLayoutEffect } from "react";
import { GiTireIronCross } from "react-icons/gi";

const MIN_TEXTAREA_HEIGHT = 45;

type CreatePostParam = {
  onHide: () => void;
};

const CreatePost = ({ onHide }: CreatePostParam) => {
  const destextareaRef = useRef<HTMLTextAreaElement>(null);
  const contextareaRef = useRef<HTMLTextAreaElement>(null);

  const { user, refreshModule } = useData();
  const [desValue, setDesValue] = useState<string>("");
  const [contentValue, setContentValue] = useState<string>("");
  const [referenceValue, setReferenceValue] = useState<string>("");
  const [titleValue, setTitleValue] = useState<string>("");
  const [authorValue, setAuthorValue] = useState<string>("");
  const [typeValue, setTypeValue] = useState<string>("");
  const [catValue, setCatValue] = useState<string>("");
  const [thumb, setThumb] = useState<FileList | null>();
  const [thumbLink, setThumbLink] = useState<string>("");
  const [validThumbLink, setValidThumbLink] = useState<boolean>(false);
  const [contentFile, setContentFile] = useState<FileList | null>();
  const [contentFileLink, setContentFileLink] = useState<string>("");
  const [validFileLink, setValidFileLink] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const onDesChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setDesValue(event.target.value);
  const onContentChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setContentValue(event.target.value);

  useLayoutEffect(() => {
    if (destextareaRef.current) {
      destextareaRef.current.style.height = "inherit";

      destextareaRef.current.style.height = `${Math.max(
        destextareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [destextareaRef]);

  useLayoutEffect(() => {
    if (contextareaRef.current) {
      contextareaRef.current.style.height = "inherit";

      contextareaRef.current.style.height = `${Math.max(
        contextareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [contentValue]);

  const submitImage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (thumb) {
      const data = new FormData();
      data.append("file", thumb[0]);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUD_PRESET as string
      );
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME as string);

      fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE as string, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.public_id) {
            setThumbLink(data.public_id);
            setButtonDisabled(false);
            setValidThumbLink(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitFile = (e: { preventDefault: () => void }) => {
    if (contentFile) {
      if (typeValue === "" || typeValue == "image") {
        e.preventDefault();
        const data = new FormData();
        data.append("file", contentFile[0]);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUD_PRESET as string
        );
        data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME as string);

        fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE as string, {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setContentFileLink(data.public_id);
            setValidFileLink(true);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        e.preventDefault();
        const data = new FormData();
        data.append("file", contentFile[0]);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUD_PRESET as string
        );
        data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME as string);

        fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE as string, {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setContentFileLink(data.public_id);
            setValidFileLink(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.post(
        "posts",
        JSON.stringify({
          title: titleValue,
          postby: user?.id,
          description: desValue,
          author: authorValue,
          type: typeValue || "image",
          category: catValue || "sports",
          thumbimage: thumbLink,
          content: contentValue,
          reference: referenceValue,
          contentfilelink: contentFileLink || null,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
      refreshModule();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section
      id="create-post"
      className="create-post show-shadow z-[10000] fixed w-[80vw] h-[80vh] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[20px] overflow-y-scroll duration-300 top-[10%] mx-[auto] left-[10%]"
    >
      {success ? (
        <section id="success-container w-full section  items-center justify-center">
          <button onClick={onHide} className="m-16">
            <GiTireIronCross className=" font-bold text-[20px]" />
          </button>
          <div className=" flex flex-col section items-center h-full gap-[2rem] pt-[2rem]">
            <div className="items-center container justify-center w-full flex flex-col rounded-[5px] py-[5rem]">
              <div className="w-full items-center border-[0.1rem] border-[black] p-[6rem] rounded-[5px]">
                <h1 className="text-center">Your post has been posted</h1>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col  m-[3rem]">
          <button onClick={onHide}>
            <GiTireIronCross className=" font-bold text-[20px]" />
          </button>
          <div>
            <h1 className=" uppercase font-bold text-center my-[1rem]">
              ~ Create A post ~
            </h1>
          </div>
          <div className="w-full p-[3rem]">
            <form
              className="create-post-form py-[1rem] w-full flex flex-col gap-[2rem] justify-between"
              onSubmit={handleSubmit}
            >
              <label
                htmlFor="title"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Title of the content</p>
                <input
                  type="text"
                  id="title"
                  className="w-[80%]"
                  onChange={(e) => setTitleValue(e.target.value)}
                  value={titleValue}
                  required
                />
              </label>
              <label
                htmlFor="createdby"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Created By</p>
                <input
                  type="text"
                  id="createdby"
                  className="w-[80%] "
                  onChange={(e) => setAuthorValue(e.target.value)}
                  value={authorValue}
                />
              </label>

              <div className="w-full flex justify-between items-center">
                <p className="w-max"> The content contains</p>
                <div className="w-[80%] flex gap-[2rem] justify-start">
                  <label
                    htmlFor="type"
                    className="flex items-center gap-[2rem] justify-between"
                  >
                    <select
                      value={typeValue}
                      id="type"
                      onChange={(e) => setTypeValue(e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                    </select>
                  </label>

                  <label
                    htmlFor="catValue"
                    className="flex items-center gap-[2rem] justify-between"
                  >
                    <p className="w-max">on</p>
                    <select
                      value={catValue}
                      id="catValue"
                      onChange={(e) => setCatValue(e.target.value)}
                    >
                      <option value="sports">Sports</option>
                      <option value="politics">Politics</option>
                      <option value="fashion">Fashion</option>
                      <option value="tech">Technology</option>
                      <option value="music-film">Music-film</option>
                    </select>
                  </label>
                </div>
              </div>

              <label
                htmlFor="description"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Short Description</p>{" "}
                <textarea
                  id="description"
                  className="w-[80%]  "
                  onChange={onDesChange}
                  ref={destextareaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                  }}
                  value={desValue}
                  required
                />
              </label>
              <label
                htmlFor="content"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Content</p>
                <textarea
                  id="content"
                  className="w-[80%] overflow-hidden p-[1rem]"
                  onChange={onContentChange}
                  ref={contextareaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                  }}
                  value={contentValue}
                  required
                />
              </label>
              <label
                htmlFor="reference"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Reference</p>{" "}
                <textarea
                  id="reference"
                  className="w-[80%] overflow-hidden p-[1rem]"
                  style={{ height: "3rem" }}
                  onChange={(e) => setReferenceValue(e.target.value)}
                  value={referenceValue}
                  required
                />
              </label>

              <label
                htmlFor="thumb"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Thumbnail</p>{" "}
                <div className="w-[80%] flex justify-between items-center">
                  <input
                    type="file"
                    id="thumb"
                    onChange={(e) => setThumb(e.target.files)}
                    aria-describedby="filenote"
                    className="w-[80%] bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                    required
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validThumbLink ? "text-[#262520]" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validThumbLink ? "hide" : "text-[#30302c]"}
                  />
                  <button
                    onClick={submitImage}
                    className="border-[1px] border-black rounded-md p-2"
                  >
                    add image
                  </button>
                </div>
              </label>

              <label
                htmlFor="contentFile"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">
                  Upload {typeValue ? typeValue : "image"}*
                </p>
                <div className="w-[80%] flex justify-between items-center">
                  <input
                    type="file"
                    id="contentFile"
                    onChange={(e) => setContentFile(e.target.files)}
                    aria-describedby="filenote"
                    className="w-[80%] bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validFileLink ? "text-[#262520]" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validFileLink ? "hide" : "text-[#30302c]"}
                  />
                  <button
                    onClick={submitFile}
                    className="border-[1px] border-black rounded-md p-2"
                  >
                    add file
                  </button>
                </div>
              </label>

              <div className="w-full flex justify-end p-[1rem]">
                <div className="flex bg-[#081c15]  text-[#fefae0] rounded-[3px]">
                  <span className="spooky-button">
                    <button type="submit" disabled={isButtonDisabled}>
                      publish
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreatePost;
