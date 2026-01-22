  <input
    type={type}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    aria-invalid={!!error}
    aria-describedby={error ? errorId : undefined}
    aria-label={ariaLabel ?? label}
    className="block w-full h-5 rounded-md border-2 border-gray-200 bg-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 text-sm"
    {...register(name)}
  /> 