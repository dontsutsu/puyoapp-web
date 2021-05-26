package com.dontsutsu.puyoapp.domain.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import com.dontsutsu.puyoapp.domain.entity.Player;

/**
 * @author f-akamatsu
 */
@Repository
public class PlayerRepository {

	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	public List<Player> findAll() {
		String sql = "SELECT * "
					+ "FROM player "
					+ "ORDER BY player_id ";
		try {
			return jdbcTemplate.query(
					sql,
					new BeanPropertyRowMapper<Player>(Player.class)
					);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public Player findOne(Integer playerId) {
		String sql = "SELECT * "
					+ "FROM player "
					+ "WHERE player_id = :playerId ";
		SqlParameterSource param = new MapSqlParameterSource().addValue("playerId", playerId);
		try {
			return jdbcTemplate.queryForObject(
					sql,
					param,
					new BeanPropertyRowMapper<Player>(Player.class)
					);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}
}
