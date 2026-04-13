"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ColorIcon, ItalicsIcon, ListIcon } from "./ui/icons";

const COLORS = [
  { label: "Default", value: null },
  { label: "Slate", value: "#475569" },
  { label: "Rose", value: "#e11d48" },
  { label: "Orange", value: "#ea580c" },
  { label: "Amber", value: "#d97706" },
  { label: "Emerald", value: "#059669" },
  { label: "Teal", value: "#0d9488" },
  { label: "Sky", value: "#0284c7" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
];

interface EditorProps {
  onDone?: () => void;
  className?: string;
}

export default function Editor({ onDone, className }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start typing your chaos here...",
      }),
    ],
    content: "",
    immediatelyRender: false,
  });

  const isItalicActive = editor?.isActive("italic") ?? false;
  const isBulletActive = editor?.isActive("bulletList") ?? false;
  const currentColor = editor?.getAttributes("textStyle").color ?? null;

  return (
    <div
      className={
        "relative flex flex-col min-h-80 w-full rounded-xl overflow-x-hidden"
      }
    >
      <div className="pt-10 max-h-96 overflow-y-auto">
        <EditorContent
          editor={editor}
          className={cn(
            "min-h-50 outline-none",
            "[&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:min-h-50",
            "[&_.ProseMirror]:text-2xl",
            "[&_.ProseMirror]:font-light",
            "[&_.ProseMirror]:text-slate-700",
            "[&_.ProseMirror]:leading-relaxed",
            "[&_.ProseMirror_ul]:list-disc",
            "[&_.ProseMirror_ul]:pl-6",
            "[&_.ProseMirror_ol]:list-decimal",
            "[&_.ProseMirror_ol]:pl-6",
          )}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-end gap-2 px-6 py-4">
        <Toggle
          size="sm"
          pressed={isItalicActive}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            "data-[state=on]:bg-teal-50 data-[state=on]:text-teal-600",
            "transition-colors",
          )}
          aria-label="Italic"
        >
          <ItalicsIcon />
        </Toggle>

        <Toggle
          size="sm"
          pressed={isBulletActive}
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          className={cn(
            "h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            "data-[state=on]:bg-teal-50 data-[state=on]:text-teal-600",
            "transition-colors",
          )}
          aria-label="Bullet list"
        >
          <ListIcon />
        </Toggle>

        {/* Color palette popover */}
        <Popover>
          <PopoverTrigger>
            <button
              className={cn(
                "h-8 w-8 p-0 rounded-md flex items-center justify-center relative",
                "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
                "transition-colors",
              )}
              aria-label="Text color"
            >
              <ColorIcon />
              {/* Small dot showing active color */}
              {currentColor && (
                <span
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-white"
                  style={{ backgroundColor: currentColor }}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end" sideOffset={8}>
            <p className="text-xs text-slate-400 mb-2 font-medium tracking-wide uppercase">
              Text color
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {COLORS.map(({ label, value }) => (
                <button
                  key={label}
                  aria-label={label}
                  title={label}
                  onClick={() => {
                    if (value === null) {
                      editor?.chain().focus().unsetColor().run();
                    } else {
                      editor?.chain().focus().setColor(value).run();
                    }
                  }}
                  className={cn(
                    "w-7 h-7 rounded-md border-2 transition-all hover:scale-110",
                    currentColor === value
                      ? "border-slate-500 scale-110"
                      : "border-transparent hover:border-slate-300",
                  )}
                  style={{ backgroundColor: value ?? "#e2e8f0" }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="secondary"
          onClick={onDone}
          className="px-6 py-4 flex gap-2"
        >
          DONE
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
