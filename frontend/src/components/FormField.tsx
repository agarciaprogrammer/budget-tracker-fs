import styles from '../styles/global.module.css';

interface Option {
  value: string;
  label: string;
}

export interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: Option[];
    required?: boolean;
}

export default function FormField({label, type, name, value, onChange, options, required}: FormFieldProps) {
    return (
        <div className={styles.formField}>
            <label htmlFor={name} className={styles.label}>
                {label}{required && <span className={styles.required}>*</span>}
            </label>
            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={styles.selectFormField}
                    required={required}
                >
                    <option value="">Seleccionar...</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type || 'text'}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={styles.inputFormField}
                    required={required}
                />
            )}
        </div>
    );
}
