import React, { createContext, useContext, useId } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Asegúrate de instalar 'react-hook-form' en tu proyecto para que este componente funcione correctamente
import { Controller, FormProvider, useFormContext, useFormState, FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import { Label } from './label';
import { Colors } from '@/constants/theme';

const Form = FormProvider;

// Contextos para campos e items
const FormFieldContext = createContext<any>({});
const FormItemContext = createContext<any>({});

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error('useFormField debe usarse dentro de <FormField>');
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({ style, children }: { style?: any; children: React.ReactNode }) {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.item, style]}>{children}</View>
    </FormItemContext.Provider>
  );
}

function FormLabel({ style, children, ...props }: { style?: any; children: React.ReactNode; [key: string]: any }) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      style={[error && styles.errorLabel, style]}
      htmlFor={formItemId}
      {...props}
    >
      {children}
    </Label>
  );
}

function FormControl({ children }: { children: React.ReactNode }) {
  // En React Native, aria-describedby y aria-invalid no aplican igual
  return <>{children}</>;
}

function FormDescription({ style, ...props }: { style?: any; [key: string]: any }) {
  const { formDescriptionId } = useFormField();
  return (
    <Text style={[styles.description, style]} nativeID={formDescriptionId} {...props} />
  );
}

function FormMessage({ style, ...props }: { style?: any; [key: string]: any }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;
  if (!body) return null;
  return (
    <Text style={[styles.message, style]} nativeID={formMessageId} {...props}>
      {body}
    </Text>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 12,
  },
  errorLabel: {
    color: Colors.destructive,
  },
  description: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  message: {
    color: Colors.destructive,
    fontSize: 13,
    marginTop: 2,
  },
});

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
