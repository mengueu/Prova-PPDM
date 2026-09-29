import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { CORES } from '../constants/cores';

type Props = TextInputProps & {
  label: string;
  corDestaque?: string;
};

export default function CampoTexto({
  label,
  corDestaque = CORES.primaria,
  ...props
}: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.campo,
          focado && { borderColor: corDestaque, backgroundColor: CORES.card },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          {...props}
          onFocus={(e) => {
            setFocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            props.onBlur?.(e);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: CORES.texto,
    marginBottom: 8,
  },
  campo: {
    backgroundColor: CORES.fundo,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  input: {
    paddingVertical: 14,
    fontSize: 16,
    color: CORES.texto,
  },
});