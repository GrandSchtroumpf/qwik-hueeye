import { component$, useStyles$ } from "@builder.io/qwik";
import { CheckItem, CheckList, Input, Radio, RadioGroup } from "../../components/form";
import { SearchForm } from "../../components/form/search-form";
import { useSearchParamsProvider } from "../../components/hooks/useSearchParams";
import { Select } from "../../components/form/select/select";
import { Option } from "../../components/form/option/option";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles)
  const { params } = useSearchParamsProvider();
  return (
    <section class="control-section">
      <h2>Search Params</h2>
      <SearchForm updateOn="input">
        <Select placeholder="Select multiple movies" name="movies" multi>
          <Option value="lotr">Lord of the Ring</Option>
          <Option value="matrix">Matrix</Option>
          <Option value="star-wars">Star Wars</Option>
        </Select>
        <Select placeholder="Select Justify (bound with radio)" name="justify">
          <Option value="bottom">Bottom</Option>
          <Option value="center">Center</Option>
          <Option value="top">Top</Option>
        </Select>
        <Input name="search"/>
        <RadioGroup name="justify" aria-labelledby="radio-group">
          <Radio value="bottom">Bottom</Radio>
          <Radio value="center">Center</Radio>
          <Radio value="top">Top</Radio>
        </RadioGroup>
        <CheckList name="align">
          <legend>Align</legend>
          <CheckItem value="bottom">Bottom</CheckItem>
          <CheckItem value="center">Center</CheckItem>
          <CheckItem value="top">Top</CheckItem>
        </CheckList>
      </SearchForm>
      <p>
        {JSON.stringify(params.value)}
      </p>
    </section>
  )
})