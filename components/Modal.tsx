'use client'

import {useState, Fragment, useRef, FormEvent} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {useModalStore} from "@/Store/ModalStore";
import {useBoardStore} from "@/Store/BoardStore";
import TaskTypeRadioGroup from "@/components/TaskTypeRadioGroup";
import Image from "next/image";
import {PhotoIcon} from "@heroicons/react/16/solid";

function Modal() {

    const imagePickerRef = useRef<HTMLInputElement>(null);

    const [addTask, image, setImage, newTaskInput, setNewTaskInput,newTaskType] = useBoardStore((state) =>[
        state.addTask,
        state.image,
        state.setImage,
        state.newTaskInput,
        state.setNewTaskInput,
        state.newTaskType,
,
    ])



  //let [isOpen, setIsOpen] = useState(true);
      const [isOpen, closeModal]= useModalStore((state) =>[
          state.isOpen,
          state.closeModal,
      ])

    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!newTaskInput) return;

        //add task
        addTask(newTaskInput, newTaskType, image);

        setImage(null);
        closeModal();
    }

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
          onSubmit={ handleSubmit}
          className="relative z-10"
          as="form"
          onClose={closeModal}>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">

          <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-980 pb-2">Add a task</Dialog.Title>

            <div className="mt-2">
                <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="enter a task here ..."
                    className="w-full border border-gray-300 rounded-md outkine-none p-5"
                />

            </div>
                /*choice*/
              <TaskTypeRadioGroup/>

              <div>
                  <button
                      type="button"
                      onClick={()=>{
                      imagePickerRef.current?.click()}
                      }
                      className=" w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block"/>
                  </button>
                  { image && (
                      <Image
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale
                      transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                      onClick={()=>{
                          setImage(null);
                      }}
                      />
                  )}
                  <input
                  type="file"
                  ref={imagePickerRef}
                  hidden
                  onChange={(e) =>{
                  if(!e.target.files![0].type.startsWith("image/")) return;
                  setImage(e.target.files![0]);
                  }
                  }/>


              </div>

            <div>
                <button
                    disabled={!newTaskInput}
                type="submit"
                className=" mt-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                disabled:cursor-not-allowed">
                    add Task
                </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
          </div>

      </Dialog>
    </Transition>
  )
}

export default Modal