import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  filters = [],
  filterValues = {},
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filterValues[filter.key] || 'all'}
          onValueChange={(val) => onFilterChange?.(filter.key, val)}
          className="w-[180px]"
        >
          <option value="all">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      ))}
    </div>
  )
}
