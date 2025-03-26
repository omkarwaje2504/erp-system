export default function InputField({ label, type, name, value, onChange, placeholder }) {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-1 capitalize">{label}</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
        />
      </div>
    );
  }
  