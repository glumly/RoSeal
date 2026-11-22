import classNames from "classnames";
import type { ComponentChild, ComponentChildren } from "preact";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "preact/hooks";
import { useOnClickOutside } from "usehooks-ts";
import Icon from "./Icon";
import Loading from "./Loading";
import TextInput from "./TextInput";

export type ItemLookupProps<
	T extends {
		key: string | number;
	},
> = {
	items?: T[] | null;
	errorMessage?: string;
	loading?: boolean;
	className?: string;
	listClassName?: string;
	children?: ComponentChildren;
	onClick: (item: T) => void;
	render: (item: T) => ComponentChild;

	inputPlaceholder: string;
	inputClassName?: string;
	inputDisabled?: boolean;
	onType: (value: string) => void;
	onSubmit: (value: string) => void;
	inputValue: string;
	blurOnSubmit?: boolean;
};

export default function ItemLookup<
	T extends {
		key: string | number;
	},
>({
	items,
	errorMessage,
	loading,
	className,
	listClassName,
	children,
	onClick,
	render,
	inputPlaceholder,
	inputClassName,
	inputDisabled,
	onType,
	onSubmit,
	inputValue,
	blurOnSubmit = true,
}: ItemLookupProps<T>) {
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [menuBounds, setMenuBounds] = useState({ height: 240, above: false });
	const listId = useId();
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => setActiveIndex(-1), [inputValue, items]);
	useLayoutEffect(() => {
		if (!open) return;
		const measure = () => {
			if (!ref.current) return;
			const rect = ref.current.getBoundingClientRect();
			const modal = ref.current.closest(".modal-content")?.getBoundingClientRect();
			const below = Math.min(innerHeight, modal?.bottom ?? innerHeight) - rect.bottom - 8;
			const above = rect.top - Math.max(0, modal?.top ?? 0) - 8;
			const useAbove = below < 120 && above > below;
			setMenuBounds({ height: Math.max(40, Math.min(240, useAbove ? above : below)), above: useAbove });
		};
		measure();
		window.addEventListener("resize", measure);
		window.addEventListener("scroll", measure, true);
		return () => {
			window.removeEventListener("resize", measure);
			window.removeEventListener("scroll", measure, true);
		};
	}, [open]);

	useOnClickOutside(ref, () => setOpen(false));

	return (
		<div
			className={classNames(
				"item-lookup input-group with-search-bar",
				{
					open,
					"form-has-error": errorMessage,
				},
				className,
			)}
			ref={ref}
			onKeyDownCapture={(event) => {
				if (event.key === "Escape") { setOpen(false); event.stopPropagation(); }
				if (event.key === "Tab") setOpen(false);
				if ((event.key === "ArrowDown" || event.key === "ArrowUp") && items?.length) {
					event.preventDefault();
					setOpen(true);
					const next = (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
					setActiveIndex(next);
					ref.current?.querySelectorAll(".search-result")[next]?.scrollIntoView({ block: "nearest" });
				}
				if (event.key === "Enter" && open && activeIndex >= 0 && items?.[activeIndex]) {
					event.preventDefault(); event.stopPropagation();
					onClick(items[activeIndex]); setOpen(false);
				}
			}}
			onFocus={() => setOpen(true)}
			onClick={(e) => e.stopPropagation()}
		>
			<TextInput
				role="combobox"
				aria-expanded={open}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
				className={classNames("item-lookup-field", inputClassName)}
				placeholder={inputPlaceholder}
				maxLength={20}
				onType={onType}
				onEnter={onSubmit}
				blurOnEnter={blurOnSubmit}
				value={inputValue}
				disabled={inputDisabled}
			/>
			{children}
			<div className="input-group-btn">
				<button
					className="input-addon-btn"
					type="button"
					onClick={() => {
						onSubmit(inputValue);
					}}
				>
					<Icon name="search" />
				</button>
			</div>
			{open && (
				<div
					id={listId}
					role="listbox"
					style={{ maxHeight: menuBounds.height, top: menuBounds.above ? "auto" : "100%", bottom: menuBounds.above ? "100%" : "auto" }}
					className={classNames(
						"dropdown-menu search-results-dropdown-menu roseal-scrollbar",
						listClassName,
					)}
				>
					{items && !errorMessage && !loading ? (
						items.map((item, index) => (
							<div
								tabIndex={-1}
								id={`${listId}-${index}`}
								role="option"
								aria-selected={activeIndex === index}
								key={item.key}
								className={classNames("search-result", {
										active: index === activeIndex,
								})}
								onClick={() => {
									onClick(item);
									setOpen(false);
								}}
							>
								{render(item)}
							</div>
						))
					) : errorMessage && !loading ? (
						<div className="text-center">
							<span className="text-error">{errorMessage}</span>
						</div>
					) : (
						loading && (
							<div className="search-result-loading">
								<Loading size="sm" />
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
}
