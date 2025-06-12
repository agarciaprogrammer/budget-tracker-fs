import styles from '../styles/global.module.css';

export interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: string[];
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
                    className={styles.select}
                    required={required}
                >
                    {options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
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
                    className={styles.input}
                    required={required}
                />
            )}
        </div>
    );
}
