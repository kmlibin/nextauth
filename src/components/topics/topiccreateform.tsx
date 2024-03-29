"use client";
import { useFormState } from "react-dom";
import FormButton from "../common/form-button";

import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import * as actions from "../../app/actions";

export default function TopicCreateForm() {
  //errors object, an empty object, matches the type we declared in the create topic action
  const [formState, action] = useFormState(actions.createTopic, {
    errors: {},
  });
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              //add these with nextui so it displays errors. without next ui, just display as normal.
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.join(", ")}
            />
            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe Your Topic"
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(", ")}
            />
            {/* if there are generic errors */}

            {formState.errors._form ? (
              <div className="p-2 bg-red-200 border border-red-400">
                {formState.errors._form?.join(", ")}
              </div>
            ) : null}
            <FormButton>Create Topic</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
