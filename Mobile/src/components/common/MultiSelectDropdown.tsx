import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '@/src/constants/theme';

interface MultiSelectDropdownProps {
  label: string;
  data: { label: string; value: number }[];
  values: number[];
  onChange: (values: number[]) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  icon?: string;
}

export default function MultiSelectDropdown({
  label,
  data,
  values,
  onChange,
  placeholder = 'Select...',
  error,
  required = false,
  disabled = false,
  searchable = true,
  icon = 'list-outline',
}: MultiSelectDropdownProps) {
  
  // Safety check - ensure values is always an array
  const safeValues = values || [];
  const safeData = data || [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <MultiSelect
        style={[
          styles.dropdown,
          error ? styles.dropdownError : null,
          disabled ? styles.dropdownDisabled : null,
        ]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.inputSearch}
        iconStyle={styles.iconStyle}
        data={safeData}
        search={searchable}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={safeValues}
        onChange={(items) => onChange(items)}
        disable={disabled}
        renderLeftIcon={() => (
          <Ionicons
            name={icon as any}
            size={20}
            color={COLORS.textSecondary}
            style={styles.leftIcon}
          />
        )}
        selectedStyle={styles.selectedItem}
        activeColor={COLORS.primaryLight}
      />

      {safeValues.length > 0 && (
        <View style={styles.selectedContainer}>
          {safeData
            .filter((item) => safeValues.includes(item.value))
            .map((item) => (
              <View key={item.value} style={styles.chip}>
                <Text style={styles.chipText}>{item.label}</Text>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={COLORS.primary}
                  onPress={() => onChange(safeValues.filter((v) => v !== item.value))}
                />
              </View>
            ))}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.error,
  },
  dropdown: {
    minHeight: 56,
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  dropdownError: {
    borderColor: COLORS.error,
  },
  dropdownDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  placeholder: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  selectedText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  inputSearch: {
    height: 44,
    fontSize: 14,
    borderRadius: RADIUS.sm,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  selectedItem: {
    borderRadius: RADIUS.sm,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});