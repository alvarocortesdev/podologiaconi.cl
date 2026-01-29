import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, GripVertical } from "lucide-react";

export default function SortableCard({ card, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-xl border border-primary/10 flex items-center gap-4 shadow-sm w-full min-w-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-primary/40 hover:text-primary active:cursor-grabbing shrink-0"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-primary break-words">{card.title}</h4>
        {card.subtitle && (
          <p className="text-sm text-primary/70 break-words">{card.subtitle}</p>
        )}
        {card.details && (
          <p className="text-xs text-primary/50 mt-1 break-words">
            {card.details}
          </p>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(card)}
          className="p-2 text-primary/70 hover:bg-secondary/20 hover:text-primary rounded-lg transition-colors"
          type="button"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="p-2 text-primary/70 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
