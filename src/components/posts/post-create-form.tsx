"use client";
import { useFormState } from "react-dom";
import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  divider,
} from "@nextui-org/react";
import * as actions from "../../app/actions";
import FormButton from "../common/form-button";

//we need to pass the slug so it can eventually be passed to the server action for creating a topic.
interface PostCreateFormProps {
  slug: string;
}

export default function PostCreateForm({ slug }: PostCreateFormProps) {
  //we have useFormState, which passes along form information. but we also need to include the slug, which isn't in the form info. how?
  //now there are three arguments. slug, formState, formData. so now need to update the type definition for server action
  const [formState, action] = useFormState(
    actions.createPost.bind(null, slug),
    { errors: {} }
  );

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Post</Button>
      </PopoverTrigger>

      {/* //all content that appears when user clicks the button */}
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              //remember, the name prop is what's sent to server action, so title and content
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="title"
              isInvalid={!!formState.errors.title}
              errorMessage={formState.errors.title?.join(", ")}
            />
            <Textarea
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="content"
              isInvalid={!!formState.errors.content}
              errorMessage={formState.errors.content?.join(", ")}
            />

            <FormButton>Create Post</FormButton>
            {formState.errors._form ? (
              <div className="rounded p-2 bg-red-200 border border-red-400">
                {formState.errors._form.join(", ")}
              </div>
            ) : null}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
